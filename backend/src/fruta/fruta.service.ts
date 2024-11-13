import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_fruta } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class FrutaService {

    constructor(private prisma: PrismaService) {}

    async getAllFrutas(): Promise<vi_fruta[]> {
        return await this.prisma.vi_fruta.findMany({
            include: {
                vi_producto_fruta: {
                    include: {
                        vi_producto: true,
                    },
                    where: { estaactivo: true },
                },
            },
        });
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
              usuariocreacion: "admin", // TODO: Cambiar por usuario logueado
            },
        });

        if (productos && productos.length > 0) {
            const productosAgregarData = productos.map(productoId => ({
                id_producto: productoId,
                id_fruta: frutaId,
                estaactivo: true,
                creadoen: new Date(),
                actualizadoen: new Date(),
                usuariocreacion: "admin", // TODO: Cambiar por usuario logueado
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
                usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
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
                usuariocreacion: "admin", // TODO: Cambiar por usuario logueado
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
                    usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
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

    async inactivateFruta(id: string): Promise<vi_fruta> {
        const frutaActualizada = await this.prisma.vi_fruta.update({
        where: { id },
        data: {
            estaactivo: false,
            actualizadoen: new Date(),
            desactivadoen: new Date(),
            usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
        },
        });
        await this.prisma.vi_producto_fruta.updateMany({
            where: { id_fruta: id },
            data: {
                estaactivo: false,
                desactivadoen: new Date(),
                actualizadoen: new Date(),
                usuarioactualizacion: "admin", // TODO: Cambiar por usuario logueado
            },
        });

        return frutaActualizada;
    }
}
