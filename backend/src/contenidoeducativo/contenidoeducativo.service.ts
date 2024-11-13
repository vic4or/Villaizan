import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { vi_contenidoeducativo } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ContenidoEducativoService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo contenido educativo
  async createContenidoEducativo(data: {
    id_fruta: string;
    titulo: string;
    contenidoinformacion?: string;
    tipocontenido: string;
    urlcontenido?: string;
  }): Promise<vi_contenidoeducativo> {
    return this.prisma.vi_contenidoeducativo.create({
      data: {
        id: crypto.randomUUID(), 
        titulo: data.titulo,
        contenidoinformacion: data.tipocontenido === 'Información' ? data.contenidoinformacion : null,
        tipocontenido: data.tipocontenido,
        urlcontenido: data.tipocontenido !== 'informacion' ? data.urlcontenido : null,
        fechapublicacion: new Date(),
        usuariocreacion: "admin", //TODO: Cambiar por usuario logueado 
        vi_fruta: {
          connect: {
            id: data.id_fruta,
          },
        },
      },
    });
  }

  // Editar un contenido educativo existente
  async updateContenidoEducativo(
    id: string,
    data: {
      titulo?: string;
      contenidoinformacion?: string;
      tipocontenido?: string;
      urlcontenido?: string;
      id_fruta?: string;
    },
  ): Promise<vi_contenidoeducativo> {
    return this.prisma.vi_contenidoeducativo.update({
      where: { id: id },
      data: {
        titulo: data.titulo,
        contenidoinformacion: data.tipocontenido === 'Información' ? data.contenidoinformacion : null,
        tipocontenido: data.tipocontenido,
        urlcontenido: data.tipocontenido !== 'Información' ? data.urlcontenido : null,
        actualizadoen: new Date(),
        usuarioactualizacion: "admin", //TODO: Cambiar por usuario logueado
        vi_fruta: data.id_fruta
          ? {
              connect: {
                id: data.id_fruta,
              },
            }
          : undefined,
      },
    });
  }

  async getAllContenidosEducativos(): Promise<vi_contenidoeducativo[]> {
    return this.prisma.vi_contenidoeducativo.findMany(
      {
        where: {
          estaactivo: true,
        }
      },
    );
  }

  async getContenidoEducativoById(id: string): Promise<vi_contenidoeducativo> {
    return this.prisma.vi_contenidoeducativo.findUnique({
      where: { id: id },
    });
  }

  async inactivateContenidoEducativo(id: string): Promise<vi_contenidoeducativo> {
    return this.prisma.vi_contenidoeducativo.update({
      where: { id: id },
      data: {
        estaactivo: false,
        desactivadoen: new Date(),
        actualizadoen: new Date(),
        usuarioactualizacion: "admin", //TODO: Cambiar por usuario logueado
      },
    });
  }
}

