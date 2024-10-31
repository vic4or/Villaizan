import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';


@Injectable()
export class ComboService {

    constructor(private prisma: PrismaService) {}

    async findAll(){
        return await this.prisma.vi_combo.findMany({
            where: {
                estado: true
            }
        })
    }

    async findOne(id: string) {
        return await this.prisma.vi_combo.findFirst({
            where: {
                id,
                estado: true,
            },
            include: {
                vi_combo_x_producto: {
                    include: {
                        vi_producto: true, // Incluir los detalles del producto
                    },
                },
            },
        });
    }
    
    async create(createComboDto: CreateComboDto) {
        // Paso 1: Obtener el último ID para calcular el nuevo ID
        const lastCombo = await this.prisma.vi_combo.findMany({
            orderBy: { id: 'desc' },
            take: 1
        });
        
        const newId = lastCombo.length > 0
            ? (parseInt(lastCombo[0].id) + 1).toString()
            : '1';
    
        // Crear el objeto Prisma.vi_promocionCreateInput
        const comboData: Prisma.vi_comboCreateInput = {
            id: newId,
            titulo: createComboDto.titulo,
            descripcion: createComboDto.descripcion,
            fechainicio: new Date(createComboDto.fechaInicio),
            fechafin: new Date(createComboDto.fechaFin),
            limitestock: createComboDto.limiteStock,
            precio: createComboDto.precio,
            usuariocreacion: "admin"
        };
    
        // Paso 2: Crear la nueva promoción
        const newCombo = await this.prisma.vi_combo.create({
            data: comboData
        });

        const comboProductEntries = createComboDto.productos.map(producto => {
            return {
                combo_id: newCombo.id, // ID del combo recién creado
                producto_id: producto.producto_id, // ID del producto desde el body
                cantidad: producto.cantidad // Cantidad del producto desde el body
            };
        });
    
        // Crear múltiples registros en vi_combo_x_producto
        await this.prisma.vi_combo_x_producto.createMany({
            data: comboProductEntries,
        });

        const comboNuevo = await this.prisma.vi_combo.findFirst({
            where: {
                id: newCombo.id,
                estado: true,
            },
            include: {
                vi_combo_x_producto: {
                    include: {
                        vi_producto: true, // Incluir los detalles del producto
                    },
                },
            },
        })
        return comboNuevo; // Devuelve el combo creado (opcional)
    };

    //PROBAR EL METODO
    async update(id: string, updateComboDto: UpdateComboDto) {
        // Actualizar el combo
        const comboData: Prisma.vi_comboUpdateInput = {
            titulo: updateComboDto.titulo,
            descripcion: updateComboDto.descripcion,
            fechainicio: new Date(updateComboDto.fechaInicio),
            fechafin: new Date(updateComboDto.fechaFin),
            limitestock: updateComboDto.limiteStock,
            precio: updateComboDto.precio,
        };
        
        const updatedCombo = await this.prisma.vi_combo.update({
            where: { id },
            data: comboData,
        });

        // Paso 1: Obtener los IDs de los productos que se pasan en el DTO
        const productoIds = updateComboDto.productos.map(producto => producto.producto_id);

        // Paso 2: Eliminar registros en vi_combo_x_producto que no están en el arreglo
        await this.prisma.vi_combo_x_producto.deleteMany({
            where: {
                combo_id: id,
                NOT: {
                    producto_id: { in: productoIds } // Elimina los que no están en productoIds
                }
            }
        }); 


        for (const producto of updateComboDto.productos) {
            await this.prisma.vi_combo_x_producto.upsert({
                where: {
                    combo_id_producto_id: { // Aquí debes definir un índice compuesto
                        combo_id: id,
                        producto_id: producto.producto_id
                    }
                },
                create: {
                    combo_id: id,
                    producto_id: producto.producto_id,
                    cantidad: producto.cantidad,
                },
                update: {
                    cantidad: producto.cantidad,
                }
            });
        }

        const comboActualizado = await this.prisma.vi_combo.findFirst({
            where: {
                id,
                estado: true,
            },
            include: {
                vi_combo_x_producto: {
                    include: {
                        vi_producto: true, // Incluir los detalles del producto
                    },
                },
            },
        });
        return comboActualizado; // Devuelve el combo actualizado (opcional)
    }

    async delete(id: string) {
        // Paso 1: Actualizar el combo a estado: false
        await this.prisma.vi_combo.update({
            where: { id },
            data: {
                estado: false
            }
        });

        // Paso 2: Eliminar los registros en vi_combo_x_producto asociados al combo
        await this.prisma.vi_combo_x_producto.deleteMany({
            where: {
                combo_id: id
            }
        });

        return { message: 'Combo eliminado' };
    }
      
}
