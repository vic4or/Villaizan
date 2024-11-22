import { Controller, Get, Post, Put, Body, Param, Patch } from '@nestjs/common';
import { RedencionService } from './redencion.service';
import { vi_redencion } from '@prisma/client';
import { CreateRedencionDto } from './dto/create-redencion.dto';

@Controller('redencion')
export class RedencionController {
    constructor(private readonly redencionService: RedencionService) {}
    //admin
    @Get('/admin/listarTodos')
    async getAllRedenciones(){
        return await this.redencionService.getAllRedenciones();
    }

    @Get('/admin/listarUno/:id')
    async getRedencionById(@Param('id') id: string){
        return await this.redencionService.getRedencionById(id);
    }

    @Patch('/admin/validar/:id')
    async validarRedencion(@Param('id') id: string) {
        return await this.redencionService.validarRedencion(id);
    }

    //usuario

    @Post('/cliente/crear')
    async crearRedencion(@Body() data: CreateRedencionDto): Promise<vi_redencion> {
        return await this.redencionService.createRedencionConDetalles(data);
    }

    // Obtener redenciones de un usuario con estado 'Por canjear'
    @Get('/cliente/listarPorCanjear/:idUsuario')
    async getRedencionesByUserPorCanjear(@Param('idUsuario') idUsuario: string): Promise<vi_redencion[]> {
        return await this.redencionService.getRedencionesByUserPorCanjear(idUsuario);
    }

    // Obtener redenciones de un usuario con estado 'CANJEADO'
    @Get('/cliente/listarCanjeados/:idUsuario')
    async getRedencionByUserAndEstadoCanjeado(@Param('idUsuario') idUsuario: string): Promise<vi_redencion[]> {
        return await this.redencionService.getRedencionByUserAndEstadoCanjeado(idUsuario);
  }

    // Desactivar una redención por ID
    @Patch('/cliente/inactivar/:id')
    async inactivarRedencion(@Param('id') id: string,@Body('idUsuario') idUsuario: string): Promise<vi_redencion> {
        return await this.redencionService.inactivateRedencion(id, idUsuario);
  }
}