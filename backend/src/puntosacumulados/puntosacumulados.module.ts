import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PuntosAcumuladosService } from './puntosacumulados.service';
import { PuntosAcumuladosController } from './puntosacumulados.controller';
@Module({
    imports: [PrismaModule],
    providers: [PuntosAcumuladosService],
    controllers: [PuntosAcumuladosController],
})
export class PuntosAcumuladosModule {}