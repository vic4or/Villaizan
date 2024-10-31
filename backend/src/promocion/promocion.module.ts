import { Module } from '@nestjs/common';
import { PromocionController } from './promocion.controller';
import { PromocionService } from './promocion.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromocionController],
  providers: [PromocionService]
})
export class PromocionModule {}
