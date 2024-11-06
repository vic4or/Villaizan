import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromocionService {

    constructor(private prisma: PrismaService) {}

    async findAll() {
      return await this.prisma.vi_promocion.findMany()
    }
      
}
