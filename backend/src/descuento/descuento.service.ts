import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import axios from 'axios';

@Injectable()
export class DescuentoService {

    constructor(
        private prisma: PrismaService
    ) {}

    async findAll(estado: string){
        const activo = (estado === 'true') ? true : false;
        return await this.prisma.vi_promocion.findMany({
            where: {
                estaactivo: activo
            }
        })
    }

    async findOne(id: string){
        //console.log(id)
        return await this.prisma.vi_promocion.findFirst({
            where: {
                id,
                estaactivo: true
            },
            include:{
                vi_producto: true
            }
        })
    }

    async create(createPromocionDto: CreateDescuentoDto) {
        // Paso 1: Obtener el último ID para calcular el nuevo ID
        const promociones = await this.prisma.vi_promocion.findMany();
        const lastPromocion = promociones
          .sort((a, b) => parseInt(b.id) - parseInt(a.id))
          .slice(0, 1);
        
        const newId = lastPromocion.length > 0
          ? (parseInt(lastPromocion[0].id) + 1).toString()
          : '1';
    

        const fechaInicio = new Date(createPromocionDto.fechaInicio);
        const fechaActual = new Date(); 

        // Crear el objeto Prisma.vi_promocionCreateInput
        //console.log("newId: ", newId);
        const promocionData: Prisma.vi_promocionCreateInput = {
            id: newId,
            titulo: createPromocionDto.titulo,
            descripcion: createPromocionDto.descripcion,
            fechainicio: new Date(createPromocionDto.fechaInicio),
            fechafin: new Date(createPromocionDto.fechaFin),
            limitestock: createPromocionDto.limiteStock,
            porcentajedescuento: createPromocionDto.porcentajeDescuento ?? 0,
            usuariocreacion: "admin",
            usuarioactualizacion: "admin",
            esvalido: fechaInicio <= fechaActual ? true : false
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

        const username = 'dep2.crm@gmail.com'; // Usuario de la API
        const password = '97FO4nsSpV6UneKW'; // Contraseña de la API
  
        const body = {
            "promoname": createPromocionDto.titulo,
            "promodesc": createPromocionDto.descripcion,
            "dscto": createPromocionDto.porcentajeDescuento,
            "estado": 1,
            "fechaini": createPromocionDto.fechaInicio,
            "fechafin": createPromocionDto.fechaFin,
            "stockmax": createPromocionDto.limiteStock,
            "stockact": createPromocionDto.limiteStock,
            "bdidpromo": newPromocion.id
        }

        // Codificar las credenciales para el encabezado Authorization (Basic Auth)
        const auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
        
        let id_crm=null;
        // Realizar la solicitud HTTP a la API externa usando HttpService
        try {
            const response = await axios.post('https://heladeria2.od2.vtiger.com/restapi/vtap/api/addPromotion',
                body, {
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json',  // Especificar que el cuerpo es JSON
                },
            });
            id_crm = response.data.result.id;
        } catch (error) {
            if (error.response) {
              // Si hay una respuesta del servidor
              console.error('Error de la API externa:', error.response.data);
            } else if (error.request) {
              // Si no hubo respuesta
              console.error('No se recibió respuesta de la API externa:', error.request);
            } else {
              // Otro error
              console.error('Error en la solicitud:', error.message);
            }
        }
       
        await this.prisma.vi_promocion.update({
            where: { id: newPromocion.id }, // Utiliza el 'id' como filtro para encontrar la promoción a actualizar.
            data: {
              id_crm: id_crm, // Aquí actualizas el campo 'id_crm' con el nuevo valor.
            },
        });

        

    
        return updatedPromocion; // Retorna la nueva promoción con los productos asociados
    }

    async update(id: string, updatePromocionDto: UpdateDescuentoDto) {
        
        const actual = new Date();
        // Paso 1: Actualizar la promoción
        const fechaInicio = new Date(updatePromocionDto.fechaInicio);
        const fechaFin = new Date(updatePromocionDto.fechaFin);

        const promocionData: Prisma.vi_promocionUpdateInput = {
            titulo: updatePromocionDto.titulo,
            descripcion: updatePromocionDto.descripcion,
            fechainicio: new Date(updatePromocionDto.fechaInicio),
            fechafin: new Date(updatePromocionDto.fechaFin),
            limitestock: updatePromocionDto.limiteStock,
            porcentajedescuento: updatePromocionDto.porcentajeDescuento,
            actualizadoen: actual.toISOString(),
            esvalido: fechaInicio > actual && actual < fechaFin ? true : false
            //usuariocreacion: updatePromocionDto.usuariocreacion
        };
        const updatedPromocion = await this.prisma.vi_promocion.update({
            where: { id },
            data: promocionData
        });
    
        //PARA SOLO TENER COMO PROMOCION LOS PRODUCTOS QUE SE ENVIAN EN
        // vi_productoIds
        // Paso 2: Obtener los IDs de productos asociados a la promoción antes de la actualización
        const currentProductos = await this.prisma.vi_producto.findMany({
            where: { id_promocion: updatedPromocion.id },
            select: { id: true }
        });
        
        const currentProductoIds = currentProductos.map(producto => producto.id);

        // Paso 3: Actualizar los productos asociados con el ID de la promoción
        if (updatePromocionDto.vi_productoIds) {
            // Actualizar solo los productos que están en vi_productoIds
            await this.prisma.vi_producto.updateMany({
                where: {
                    id: { in: updatePromocionDto.vi_productoIds }
                },
                data: {
                    id_promocion: updatedPromocion.id // Asigna el ID de la promoción actualizada
                }
            });
        }

        // Paso 4: Eliminar la asociación de productos que no están en vi_productoIds
        const productosToRemove = currentProductoIds.filter(id => !updatePromocionDto.vi_productoIds.includes(id));
        if (productosToRemove.length > 0) {
            await this.prisma.vi_producto.updateMany({
                where: {
                    id: { in: productosToRemove }
                },
                data: {
                    id_promocion: null // Elimina la asociación de la promoción
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
        const actual = new Date();
        
        await this.prisma.vi_promocion.update({
            where: { id },
            data: { 
                estaactivo: false,
                desactivadoen: actual.toISOString()
            }
        });
    
        // Paso 2: Actualizar los productos asociados, estableciendo id_promocion a null
        await this.prisma.vi_producto.updateMany({
            where: { id_promocion: id },
            data: { id_promocion: null } // Establecer id_promocion a null
        });
    
        return { message: 'Promoción eliminada y productos actualizados correctamente.' };
    }    

}
