import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { Puntos_ProductoService } from './puntos_producto.service';

@Controller('puntos_producto') 
export class Puntos_ProductoController {

    constructor(private readonly puntos_productoService: Puntos_ProductoService) {}

    @Get('/listarTodos')
    async getAllPuntos_Producto() {
        return await this.puntos_productoService.getAllPuntos_Producto();
    }

    @Get('/listarUno/:idPuntosProducto')
    async getPuntos_ProductoById(@Param('idPuntosProducto', ParseIntPipe) idPuntosProducto: number) {
        return await this.puntos_productoService.getPuntos_ProductoById(idPuntosProducto);
    }

    @Post('/registrar')
    async registrarPuntosProducto(
        @Body('idProducto') idProducto: string,
        @Body('cantidadPuntos') cantidadPuntos: number,
    ) {
      return await this.puntos_productoService.createPuntos_Producto(idProducto, cantidadPuntos);
    }

    @Put('/editar')
    async editarPuntosProducto(
        @Body('idPuntosProducto') idPuntosProducto: number,
        @Body('idProducto') idProducto: string,
        @Body('nuevaCantidad') nuevaCantidad: number,
    ) {
    return await this.puntos_productoService.updatePuntos_Producto(idPuntosProducto,idProducto, nuevaCantidad);
    }

    @Put('/inactivar/:idPuntosProducto')
    async inactivarPuntosProducto(@Param('idPuntosProducto', ParseIntPipe) idPuntosProducto: number) {
        return await this.puntos_productoService.inactivatePuntos_Producto(idPuntosProducto);
    }
}