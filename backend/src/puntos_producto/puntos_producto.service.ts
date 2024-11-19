import { Injectable } from '@nestjs/common';
import { vi_puntos_producto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable() 
export class Puntos_ProductoService {

    constructor(private prisma: PrismaService) {}

    async getAllPuntos_Producto(): Promise<vi_puntos_producto[]> {
        return await this.prisma.vi_puntos_producto.findMany();
    }

    async getPuntos_ProductoById(id: number): Promise<vi_puntos_producto> {
        return await this.prisma.vi_puntos_producto.findUnique({
            where: {
                id_puntosproducto: id
            }
        });
    }
    
    async createPuntos_Producto(idProducto: string, cantidadPuntos: number): Promise<vi_puntos_producto> {
        return await this.prisma.vi_puntos_producto.create({
            data: {
                id_producto: idProducto,
                cantidadpuntos: cantidadPuntos,
                usuariocreacion: "admin", // cambiar por el usuario logueado luego
            }
        });
    }

    async updatePuntos_Producto(idPuntosProducto: number, idProducto:string, nuevaCantidad:number): Promise<vi_puntos_producto> {
        
        await this.prisma.vi_puntos_producto.update({
            where: {
              id_puntosproducto: idPuntosProducto,
            },
            data: {
              estaactivo: false,
              actualizadoen: new Date(),
              desactivadoen: new Date(),
              usuarioactualizacion: "admin", // cambiar por el usuario logueado luego 
            },
        }); 

        return await this.prisma.vi_puntos_producto.create({
            data:{
                id_producto: idProducto,
                cantidadpuntos: nuevaCantidad,
                usuariocreacion: "admin", // cambiar por el usuario logueado luego
            },
        });
    }

    async inactivatePuntos_Producto(idPuntosProducto: number): Promise<vi_puntos_producto> {
        return await this.prisma.vi_puntos_producto.update({
          where: {
            id_puntosproducto: idPuntosProducto, 
          },
          data: {
            estaactivo: false,
            actualizadoen: new Date(),
            desactivadoen: new Date(),
            usuarioactualizacion:"admin", // cambiar por el usuario logueado luego
          },
        });
    }
      
}