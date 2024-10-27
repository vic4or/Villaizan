import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';import { FrutaService } from './fruta.service';
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
        @Body('descripcion') descripcion: string
    ) {
        return await this.frutaService.createFruta(nombre, descripcion);
    }

    /*
    @Put('/editar/:id')
    async editarFruta(@Param('id') id: string, @Body() data: Partial<vi_fruta>) {
        return this.frutaService.updateFruta(id, data);
    }

    @Put('/inactivar/:id')
    async inactivarFruta(@Param('id') id: string) {
        return this.frutaService.inactivateFruta(id);
    }*/
}
