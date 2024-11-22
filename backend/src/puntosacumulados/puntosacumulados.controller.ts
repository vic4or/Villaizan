import { Controller, Get, Post, Put, Body, Param, Patch } from '@nestjs/common';
import { PuntosAcumuladosService } from './puntosacumulados.service';
import { vi_puntosacumulados } from '@prisma/client';

@Controller('puntosacumulados')
export class PuntosAcumuladosController {
    constructor(private readonly PuntosAcumuladosService: PuntosAcumuladosService) {}
    
    // Pantallas usuario
    @Get('/cliente/listarTodos/:idUsuario')
    async getAllPuntosAcumuladosByUser(@Param('idUsuario') idUsuario: string): Promise<vi_puntosacumulados[]>{
        return await this.PuntosAcumuladosService.getAllPuntosAcumuladosByUser(idUsuario);
    }
}