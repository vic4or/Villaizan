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
              stockdisponible: 0,
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
            estado: false,            
            actualizadoen: new Date(),
          },
        });
      
        // creamos un nuevo registro con los datos actualizados
        return this.prisma.vi_recompensa_puntos.create({
          data: {
            id_producto: idProducto,
            puntosnecesarios: puntosNecesarios,
            stockdisponible: 0,
            creadoen: new Date(),          
            actualizadoen: new Date(),     
            usuariocreacion: null,        
            usuarioactualizacion: null,
          },
        });
      }

    async inactivateRecompensaPuntos(id: number): Promise<vi_recompensa_puntos> {
        return await this.prisma.vi_recompensa_puntos.update({
        where: {
            id_recompensa: parseInt(id.toString(), 10),
        },
        data: {
            estado: false,
            actualizadoen: new Date(),
        },
        });
    }
}

