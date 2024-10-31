import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';

@Injectable()
export class DescuentoService {

    constructor(private prisma: PrismaService) {}

    async findAll(){
        return await this.prisma.vi_promocion.findMany({
            where: {
                estado: true
            }
        })
    }

    async findOne(id: string){
        return await this.prisma.vi_promocion.findFirst({
            where: {
                id,
                estado: true
            },
            include:{
                vi_producto: true
            }
        })
    }

    async create(createPromocionDto: CreateDescuentoDto) {
        // Paso 1: Obtener el último ID para calcular el nuevo ID
        const lastPromocion = await this.prisma.vi_promocion.findMany({
            orderBy: { id: 'desc' },
            take: 1
        });
        const newId = lastPromocion.length > 0
            ? (parseInt(lastPromocion[0].id) + 1).toString()
            : '1';
    
        // Crear el objeto Prisma.vi_promocionCreateInput
        const promocionData: Prisma.vi_promocionCreateInput = {
            id: newId,
            titulo: createPromocionDto.titulo,
            descripcion: createPromocionDto.descripcion,
            fechainicio: new Date(createPromocionDto.fechaInicio),
            fechafin: new Date(createPromocionDto.fechaFin),
            limitestock: createPromocionDto.limiteStock,
            porcentajedescuento: createPromocionDto.porcentajeDescuento ?? 0,
            usuariocreacion: "admin"
        };
    
        // Paso 2: Crear la nueva promoción
        const newPromocion = await this.prisma.vi_promocion.create({
            data: promocionData
        });
    
        // Paso 3: Actualizar los productos asociados con el ID de la nueva promoción
        await this.prisma.vi_producto.updateMany({
            where: {
                id: { in: createPromocionDto.vi_productoIds }
            },
            data: {
                id_promocion: newPromocion.id // Asigna el ID de la nueva promoción
            }
        });
    
        // Opcional: Puedes volver a obtener la promoción con los productos actualizados si es necesario
        const updatedPromocion = await this.prisma.vi_promocion.findUnique({
            where: { id: newPromocion.id },
            include: { vi_producto: true } // Incluye los productos actualizados
        });
    
        return updatedPromocion; // Retorna la nueva promoción con los productos asociados
    }

    async update(id: string, updatePromocionDto: UpdateDescuentoDto) {
        // Paso 1: Actualizar la promoción
        const promocionData: Prisma.vi_promocionUpdateInput = {
            titulo: updatePromocionDto.titulo,
            descripcion: updatePromocionDto.descripcion,
            fechainicio: new Date(updatePromocionDto.fechaInicio),
            fechafin: new Date(updatePromocionDto.fechaFin),
            limitestock: updatePromocionDto.limiteStock,
            porcentajedescuento: updatePromocionDto.porcentajeDescuento,
            //usuariocreacion: updatePromocionDto.usuariocreacion
        };
        const updatedPromocion = await this.prisma.vi_promocion.update({
            where: { id },
            data: promocionData
        });
    
        // Paso 2: Actualizar los productos asociados con el ID de la promoción
        if (updatePromocionDto.vi_productoIds) {
            await this.prisma.vi_producto.updateMany({
                where: {
                    id: { in: updatePromocionDto.vi_productoIds }
                },
                data: {
                    id_promocion: updatedPromocion.id // Asigna el ID de la promoción actualizada
                }
            });
        }
    
        // Opcional: Puedes volver a obtener la promoción con los productos actualizados si es necesario
        const finalUpdatedPromocion = await this.prisma.vi_promocion.findUnique({
            where: { id },
            include: { vi_producto: true } // Incluye los productos actualizados
        });
    
        return finalUpdatedPromocion; // Retorna la promoción actualizada con los productos asociados
    }


    async delete(id: string) {
        // Paso 1: Actualizar la promoción a estado: false
        await this.prisma.vi_promocion.update({
            where: { id },
            data: { estado: false }
        });
    
        // Paso 2: Actualizar los productos asociados, estableciendo id_promocion a null
        await this.prisma.vi_producto.updateMany({
            where: { id_promocion: id },
            data: { id_promocion: null } // Establecer id_promocion a null
        });
    
        return { message: 'Promoción eliminada y productos actualizados correctamente.' };
    }    

}
