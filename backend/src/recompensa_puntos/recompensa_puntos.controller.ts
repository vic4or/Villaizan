import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { Recompensa_PuntosService } from './recompensa_puntos.service';


@Controller('recompensa_puntos')
export class Recompensa_PuntosController {
    constructor(private readonly recompensaPuntosService: Recompensa_PuntosService) {}

    @Get('/listarTodos')
    async getAllRecompensaPuntos() {
        return await this.recompensaPuntosService.getAllRecompensaPuntos();
    }

    @Get('/listarUno/:idRecompensa')
    async getRecompensaPuntosById(@Param('idRecompensa', ParseIntPipe) idRecompensa: number) {
        return await this.recompensaPuntosService.getRecompensaPuntosById(idRecompensa);
    }

    @Post('/registrar')
    async registrarRecompensaPuntos(
        @Body('id_producto') id_producto: string,
        @Body('puntosnecesarios') puntosnecesarios: number,
    ) {
        return await this.recompensaPuntosService.createRecompensaPuntos(id_producto, puntosnecesarios);
    }

    @Put('/editar')
    async editarRecompensaPuntos(
        @Body('id_recompensa') id_recompensa: number,
        @Body('id_producto') id_producto: string,
        @Body('puntosNecesarios') puntosNecesarios: number,
    ) {
        return await this.recompensaPuntosService.updateRecompensaPuntos(id_recompensa, id_producto, puntosNecesarios);
    }


    @Put('/inactivar/:idRecompensa')
    async inactivarRecompensaPuntos(@Param('idRecompensa') idRecompensa: number) {
        return await this.recompensaPuntosService.inactivateRecompensaPuntos(idRecompensa);
    }
}
