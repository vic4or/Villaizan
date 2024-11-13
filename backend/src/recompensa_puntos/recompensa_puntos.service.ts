import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_recompensa_puntos } from '@prisma/client';

@Injectable()
export class Recompensa_PuntosService {
    constructor(private prisma: PrismaService) {}

    async getAllRecompensaPuntos(): Promise<vi_recompensa_puntos[]> {
        return await this.prisma.vi_recompensa_puntos.findMany();
    }

    async getRecompensaPuntosById(id: number): Promise<vi_recompensa_puntos> {
        return await this.prisma.vi_recompensa_puntos.findUnique({
        where: {
            id_recompensa: id,
        },
        });
    }

    async createRecompensaPuntos(id_producto: string, puntosnecesarios : number): Promise<vi_recompensa_puntos> {
      
        return await this.prisma.vi_recompensa_puntos.create({
            data: {
              id_producto: id_producto,
              puntosnecesarios: puntosnecesarios,
              usuariocreacion: "admin", // cambiar por el usuario logueado luego
            },
        });
    }

    async updateRecompensaPuntos(
        idRecompensa: number,
        idProducto: string,
        puntosNecesarios: number,
        ): Promise<vi_recompensa_puntos> {
        
        await this.prisma.vi_recompensa_puntos.update({
          where: {
            id_recompensa: idRecompensa,
          },
          data: {
            estaactivo: false,            
            actualizadoen: new Date(),
            desactivadoen:new Date(),
            usuarioactualizacion: "admin", // cambiar por el usuario logueado luego
          },
        });
      
        // creamos un nuevo registro con los datos actualizados
        return this.prisma.vi_recompensa_puntos.create({
          data: {
            id_producto: idProducto,
            puntosnecesarios: puntosNecesarios,
            creadoen: new Date(),          
            actualizadoen: new Date(),     
            usuariocreacion: "admin", // cambiar por el usuario logueado luego
          },
        });
      }

    async inactivateRecompensaPuntos(id: number): Promise<vi_recompensa_puntos> {
        return await this.prisma.vi_recompensa_puntos.update({
        where: {
            id_recompensa: parseInt(id.toString(), 10),
        },
        data: {
            estaactivo: false,
            actualizadoen: new Date(),
            desactivadoen: new Date(),
            usuarioactualizacion: "admin", // cambiar por el usuario logueado luego
        },
        });
    }
}

