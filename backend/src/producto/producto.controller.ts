import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ProductoService } from './producto.service';

@Controller('productos') 
export class ProductoController {

    constructor(private readonly productoService: ProductoService) {}

    @Get('/listarTodos')
    async getAllPuntos_Producto() {
        return this.productoService.getAllProductos();
    }

}