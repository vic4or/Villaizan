import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { vi_puntosacumulados } from '@prisma/client';


@Injectable()
export class PuntosAcumuladosService {
    constructor(private prisma: PrismaService) {}

    async getAllPuntosAcumuladosByUser(id: string): Promise<vi_puntosacumulados[]> {
        return await this.prisma.vi_puntosacumulados.findMany({
            where: {
                id_usuario: id,
                estaactivo: true,
            },
            include: {
                vi_detallepuntosacumulados: {
                    include: {
                        vi_producto: true,
                        //vi_puntos_producto: true,
                    },
                    where: { estaactivo: true },
                },
            },
            orderBy: { fechatransaccion: 'desc' },
        });
    }
}