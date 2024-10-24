import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Puntos_ProductoService } from './puntos_producto.service';

@Controller('puntos_producto') 
export class Puntos_ProductoController {

    constructor(private readonly puntos_productoService: Puntos_ProductoService) {}

    @Get('/listarTodos')
    async getAllPuntos_Producto() {
        return this.puntos_productoService.getAllPuntos_Producto();
    }

}