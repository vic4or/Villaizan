import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_fruta } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class FrutaService {

    constructor(private prisma: PrismaService) {}

    async getAllFrutas(): Promise<vi_fruta[]> {
        return await this.prisma.vi_fruta.findMany();
    }

    async getFrutaById(id: string): Promise<vi_fruta> {
        return await this.prisma.vi_fruta.findUnique({
            where: { id },
            include: { 
                vi_producto_fruta: {
                    include: { vi_producto: true },
                    where: { estaactivo: true },
                }
            },
        });
    }

    async createFruta(nombre: string, descripcion?: string, productos?: string[]): Promise<vi_fruta> {
        const frutaId = randomUUID();

        const fruta = await this.prisma.vi_fruta.create({
            data: {
              id: frutaId,
              nombre: nombre,
              descripcion: descripcion ?? null ,
              urlimagen: "", //validar
              usuariocreacion: "", //validar
            },
        });

        if (productos && productos.length > 0) {
            const productosAgregarData = productos.map(productoId => ({
                id_producto: productoId,
                id_fruta: frutaId,
                estaactivo: true,
                creadoen: new Date(),
                actualizadoen: new Date(),
                usuariocreacion: "", //validar
            }));

            await this.prisma.vi_producto_fruta.createMany({
                data: productosAgregarData,
            });
        }

        return await this.prisma.vi_fruta.findUnique({
            where: { id: frutaId },
            include: { vi_producto_fruta: true },
        });

    }

    
    async updateFruta(
        id: string, 
        nombre?: string,
        descripcion?: string,
        productosParaAgregar?: string[],
        productosParaQuitar?: string[]
        ): Promise<vi_fruta> {
        const data: any = {};

        if (nombre) data.nombre = nombre;
        if (descripcion) data.descripcion = descripcion;

        const fruta = await this.prisma.vi_fruta.update({
            where: { id },
            data: {
              ...data,
              actualizadoen: new Date(),
            },
        });

        //Agregamos productos si hay
        if (productosParaAgregar && productosParaAgregar.length > 0) {
            const productosAgregarData = productosParaAgregar.map(productoId => ({
                id_producto: productoId,
                id_fruta: id,
                estaactivo: true,
                creadoen: new Date(),
                actualizadoen: new Date(),
                usuariocreacion: "", // validar/corregir despues
            }));
    
            await this.prisma.vi_producto_fruta.createMany({
                data: productosAgregarData,
            });
        }

        //Quitamos productos si hay
        if (productosParaQuitar && productosParaQuitar.length > 0) {
            await this.prisma.vi_producto_fruta.updateMany({
                where: {
                    id_fruta: id,
                    id_producto: { in: productosParaQuitar },
                },
                data: {
                    estaactivo: false,
                    desactivadoen: new Date(),
                    actualizadoen: new Date(),
                    usuarioactualizacion: "", // validar/corregir despues
                },
            });
        }
        return this.prisma.vi_fruta.findUnique({
            where: { id },
            include: {
                vi_producto_fruta: {
                    include: {
                        vi_producto: true, 
                    },
                    where: {
                        estaactivo: true,
                    }
                },
            },
        });
        
    }

    /*async inactivateFruta(id: string): Promise<fruta > {
        return this.prisma.vi_fruta.update({
        where: { id },
        data: {
            estaactivo: false,
            desactivadoen: new Date(),
        },
        });
        await this.prisma.vi_producto_fruta.updateMany({
            where: { id_fruta: id },
            data: {
                estaactivo: false,
                desactivadoen: new Date(),
                actualizadoen: new Date(),
            },
        });
    }*/
}
