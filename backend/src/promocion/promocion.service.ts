import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromocionService {

    constructor(private prisma: PrismaService) {}

    async findAll(estado?: boolean) {
        // Por defecto, el estado es true si no se especifica
        const filter = estado === false ? { estado: false } : { estado: true };
      
        // Obtiene los combos con el filtro de estado
        const combos = await this.prisma.vi_combo.findMany({
          where: filter,
        });
      
        // Añade el campo 'tipo' a cada combo
        const combosConTipo = combos.map((combo) => ({
          ...combo,
          tipo: 'combo',
        }));
      
        // Obtiene las promociones con el filtro de estado
        const promociones = await this.prisma.vi_promocion.findMany({
          where: filter,
        });
      
        // Añade el campo 'tipo' a cada promoción
        const promocionesConTipo = promociones.map((promocion) => ({
          ...promocion,
          tipo: 'descuento',
        }));
      
        // Combina los resultados y los retorna
        return [...combosConTipo, ...promocionesConTipo];
      }
      
}
