import { Injectable } from '@nestjs/common';
import { vi_puntos_producto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable() 
export class Puntos_ProductoService {

    constructor(private prisma: PrismaService) {}

    async getAllPuntos_Producto(): Promise<vi_puntos_producto[]> {
        return this.prisma.vi_puntos_producto.findMany();
    }

    async getPuntos_ProductoById(id: number): Promise<vi_puntos_producto> {
        return this.prisma.vi_puntos_producto.findUnique({
            where: {
                id_puntosproducto: id
            }
        });
    }
    
    async createPuntos_Producto(data: vi_puntos_producto): Promise<vi_puntos_producto> {
        return this.prisma.vi_puntos_producto.create({
            data
        });
    }

    async updatePuntos_Producto(id: number, data: vi_puntos_producto): Promise<vi_puntos_producto> {
        return this.prisma.vi_puntos_producto.update({
            where: {
                id_puntosproducto: id
            },
            data
        });
    }
}