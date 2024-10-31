import { Module } from '@nestjs/common';
import { DescuentoController } from './descuento.controller';
import { DescuentoService } from './descuento.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DescuentoController],
  providers: [DescuentoService]
})
export class DescuentoModule {}
