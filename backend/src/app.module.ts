import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module';
import { Puntos_ProductoModule } from './puntos_producto/puntos_producto.module';
import { FrutaModule } from './fruta/fruta.module';
import { ContenidoEducativoModule } from './contenidoeducativo/contenidoeducativo.module';
import { Recompensa_PuntosModule } from './recompensa_puntos/recompensa_puntos.module';

@Module({
  imports: [ProductoModule, Puntos_ProductoModule, FrutaModule, ContenidoEducativoModule, Recompensa_PuntosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
