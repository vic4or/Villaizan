import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedencionService } from './redencion.service';
import { RedencionController } from './redencion.controller';
@Module({
    imports: [PrismaModule],
    providers: [RedencionService],
    controllers: [RedencionController],
})
export class RedencionModule {}