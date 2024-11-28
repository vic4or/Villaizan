import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { vi_contenidoeducativo } from '@prisma/client';
import * as crypto from 'crypto';
import { url } from 'inspector';

@Injectable()
export class ContenidoEducativoService {
  constructor(private prisma: PrismaService) {}

  private convertirUrlImagen(driveUrl: string): string {
    try {
      const fileId = driveUrl.match(/\/d\/(.*?)\//)![1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    } catch (error) {
      throw new Error('URL de Drive invalida');
    }
  }

  // Crear un nuevo contenido educativo
  async createContenidoEducativo(data: {
    id_fruta: string;
    titulo: string;
    contenidoinformacion?: string;
    tipocontenido: string;
    urlcontenido?: string;
  }): Promise<vi_contenidoeducativo> {
    let urlFinal = null;

    if (data.tipocontenido === 'Imagen' && data.urlcontenido) {
      urlFinal = this.convertirUrlImagen(data.urlcontenido);
    } else if (data.tipocontenido !== 'Información') {
      urlFinal = data.urlcontenido;
    }
    
    return this.prisma.vi_contenidoeducativo.create({
      data: {
        titulo: data.titulo,
        contenidoinformacion: data.tipocontenido === 'Información' ? data.contenidoinformacion : null,
        tipocontenido: data.tipocontenido,
        urlcontenido: urlFinal,
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
    id: number,
    data: {
      titulo?: string;
      contenidoinformacion?: string;
      tipocontenido?: string;
      urlcontenido?: string;
      id_fruta?: string;
    },
  ): Promise<vi_contenidoeducativo> {

    let urlFinal = null;

    if (data.urlcontenido !== undefined) {
      if (data.tipocontenido === 'Imagen') {
        urlFinal = this.convertirUrlImagen(data.urlcontenido);
      } else if (data.tipocontenido !== 'Información') {
        urlFinal = data.urlcontenido;
      } else {
        urlFinal = null;
      }
    }
    
    return this.prisma.vi_contenidoeducativo.update({
      where: { id: id },
      data: {
        titulo: data.titulo,
        contenidoinformacion: data.tipocontenido === 'Información' ? data.contenidoinformacion : null,
        tipocontenido: data.tipocontenido,
        urlcontenido: urlFinal,
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

  async getContenidoEducativoById(id: number): Promise<vi_contenidoeducativo> {
    return this.prisma.vi_contenidoeducativo.findUnique({
      where: { id: id },
    });
  }

  async inactivateContenidoEducativo(id: number): Promise<vi_contenidoeducativo> {
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

