import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module';
import { Puntos_ProductoModule } from './puntos_producto/puntos_producto.module';
import { FrutaModule } from './fruta/fruta.module';
import { ContenidoEducativoModule } from './contenidoeducativo/contenidoeducativo.module';
import { Recompensa_PuntosModule } from './recompensa_puntos/recompensa_puntos.module';
import { DescuentoModule } from './descuento/descuento.module';
import { ComboModule } from './combo/combo.module';
import { PromocionModule } from './promocion/promocion.module';

@Module({
  imports: [ProductoModule, Puntos_ProductoModule, FrutaModule, ContenidoEducativoModule, Recompensa_PuntosModule, DescuentoModule, ComboModule, PromocionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
