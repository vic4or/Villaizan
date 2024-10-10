import { Injectable } from '@nestjs/common';
import { Puntos_Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable() 
export class Puntos_ProductoService {

    constructor(private prisma: PrismaService) {}

    async getAllPuntos_Producto(): Promise<Puntos_Producto[]> {
        return this.prisma.puntos_Producto.findMany();
    }

    async getPuntos_ProductoById(id: string): Promise<Puntos_Producto> {
        return this.prisma.puntos_Producto.findUnique({
            where: {
                id: id
            }
        });
    }
    
    async createPuntos_Producto(data: Puntos_Producto): Promise<Puntos_Producto> {
        return this.prisma.puntos_Producto.create({
            data
        });
    }

    async updatePuntos_Producto(id: string, data: Puntos_Producto): Promise<Puntos_Producto> {
        return this.prisma.puntos_Producto.update({
            where: {
                id
            },
            data
        });
    }
}