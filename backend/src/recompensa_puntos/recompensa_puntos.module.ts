import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Recompensa_PuntosController } from './recompensa_puntos.controller';
import { Recompensa_PuntosService } from './recompensa_puntos.service';

@Module({
    imports: [PrismaModule],
    controllers: [Recompensa_PuntosController],
    providers: [Recompensa_PuntosService],
})
export class Recompensa_PuntosModule {}