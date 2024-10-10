import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Puntos_ProductoController } from './puntos_producto.controller';
import { Puntos_ProductoService } from './puntos_producto.service';

@Module({
    imports: [PrismaModule],
    controllers: [Puntos_ProductoController],
    providers: [Puntos_ProductoService],
})
export class Puntos_ProductoModule {}