import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';

@Module({
    imports: [PrismaModule],
    controllers: [ProductoController],
    providers: [ProductoService],
})
export class ProductoModule {}