import { Controller, Get, Post, Put, Body, Param, Patch } from '@nestjs/common';import { FrutaService } from './fruta.service';
import { vi_fruta } from '@prisma/client';

@Controller('fruta')
export class FrutaController {

    constructor(private readonly frutaService: FrutaService) {}

    @Get('/listarTodos')
    async getAllFrutas() {
        return await this.frutaService.getAllFrutas();
    }

    @Get('/listarUno/:idFruta')
    async getFrutaById(@Param('idFruta') idFruta: string) {
        return await this.frutaService.getFrutaById(idFruta);
    }

    @Post('/registrar')
    async registrarFruta(
        @Body('nombre') nombre: string,
        @Body('descripcion') descripcion?: string,
        @Body('productos') productos?: string[],
    ) {
        return await this.frutaService.createFruta(nombre, descripcion,productos);
    }

    
    @Patch('/editar/:id')
    async editarFruta(
        @Param('id') id: string,
        @Body('nombre') nombre?: string,
        @Body('descripcion') descripcion?: string,
        @Body('productosParaAgregar') productosParaAgregar?: string[],
        @Body('productosParaQuitar') productosParaQuitar?: string[],
    ) {
        return await this.frutaService.updateFruta(id, nombre, descripcion, productosParaAgregar, productosParaQuitar);
    }
    /*
    @Put('/inactivar/:id')
    async inactivarFruta(@Param('id') id: string) {
        return this.frutaService.inactivateFruta(id);
    }*/
}
