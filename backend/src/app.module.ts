import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module';
import { Puntos_ProductoModule } from './puntos_producto/puntos_producto.module';

@Module({
  imports: [ProductoModule, Puntos_ProductoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
