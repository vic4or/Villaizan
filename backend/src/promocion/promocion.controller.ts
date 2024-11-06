import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PromocionService } from './promocion.service';

@Controller('promocion')
export class PromocionController {

    constructor(private readonly promocionService: PromocionService) {}

    @Get('/listarTodos')
    findAll(){
        return this.promocionService.findAll();
    }

}
