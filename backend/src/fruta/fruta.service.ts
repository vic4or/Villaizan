import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_fruta } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class FrutaService {

    constructor(private prisma: PrismaService) {}

    async getAllFrutas(): Promise<vi_fruta[]> {
        return await this.prisma.vi_fruta.findMany({
        where: { estaactivo: true },  // Solo frutas activas
        });
    }

    async getFrutaById(id: string): Promise<vi_fruta> {
        return await this.prisma.vi_fruta.findUnique({
        where: { id },
        });
    }

    //Modo prueba
    async createFruta(nombre: string, descripcion: string): Promise<vi_fruta> {
        return await this.prisma.vi_fruta.create({
            data: {
              id: randomUUID(),
              nombre: nombre,
              descripcion: descripcion ,
              urlimagen: "", //validar
              usuariocreacion: "", //validar
            },
          });
    }

    /*
    async updateFruta(id: string, data: Partial<vi_fruta>): Promise<vi_fruta> {
        return this.prisma.vi_fruta.update({
            where: { id },
            data: {
              ...data,
              actualizadoen: new Date(),
            },
          });
    }

    async inactivateFruta(id: string): Promise<vi_fruta> {
        return this.prisma.vi_fruta.update({
        where: { id },
        data: {
            estaactivo: false,
            desactivadoen: new Date(),
        },
        });
    }*/
}
