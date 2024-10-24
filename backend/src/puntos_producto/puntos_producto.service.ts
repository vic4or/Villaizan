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
    
    async createPuntos_Producto(idProducto: string, cantidadPuntos: number): Promise<vi_puntos_producto> {
        return this.prisma.vi_puntos_producto.create({
            data: {
                id_producto: idProducto,
                cantidadpuntos: cantidadPuntos 
            }
        });
    }

    async updatePuntos_Producto(idPuntosProducto: number, idProducto:string, nuevaCantidad:number): Promise<vi_puntos_producto> {
        
        await this.prisma.vi_puntos_producto.update({
            where: {
              id_puntosproducto: idPuntosProducto,
            },
            data: {
              estado: false,
              fechainactivo: new Date(),  
            },
        }); 

        return this.prisma.vi_puntos_producto.create({
            data:{
                id_producto: idProducto,
                cantidadpuntos: nuevaCantidad,
            },
        });
    }

    async inactivatePuntos_Producto(idPuntosProducto: number): Promise<vi_puntos_producto> {
        return this.prisma.vi_puntos_producto.update({
          where: {
            id_puntosproducto: idPuntosProducto, 
          },
          data: {
            estado: false,
            fechainactivo: new Date(),
          },
        });
    }
      
}