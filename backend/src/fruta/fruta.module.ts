import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FrutaService } from './fruta.service';
import { FrutaController } from './fruta.controller';

@Module({
    imports: [PrismaModule],
    controllers: [FrutaController],
    providers: [FrutaService],
})
export class FrutaModule {}
