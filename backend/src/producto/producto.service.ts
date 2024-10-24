import { Injectable } from '@nestjs/common';
import { vi_producto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductoService {

    constructor(private prisma: PrismaService) {}

    async getAllProductos(): Promise<vi_producto[]> {
        return this.prisma.vi_producto.findMany({
            where: {
                estado: true
            }
        });
    }
}