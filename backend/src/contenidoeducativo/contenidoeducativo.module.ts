import { Module } from '@nestjs/common';
import { ContenidoEducativoService } from './contenidoeducativo.service';
import { ContenidoEducativoController } from './contenidoeducativo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContenidoEducativoController],
  providers: [ContenidoEducativoService],
})
export class ContenidoEducativoModule {}
