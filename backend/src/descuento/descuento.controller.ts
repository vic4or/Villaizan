import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DescuentoService } from './descuento.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';

@Controller('descuento')
export class DescuentoController {

    constructor(private readonly descuentoService: DescuentoService) {}

    @Get('/listarTodos')
    findAll(@Query ('estado') estado: string){
        return this.descuentoService.findAll(estado);
    }

    @Get('/listarUno/:id')
    findOne(@Param('id') id: string){
        return this.descuentoService.findOne(id);
    }

    @Post('/registrar')
    create(@Body() createDescuentoDto: CreateDescuentoDto){
        return this.descuentoService.create(createDescuentoDto);
    }

    @Patch('/editar/:id')
    update(@Param('id') id:string, @Body() updateDescuentoDto: UpdateDescuentoDto){
        return this.descuentoService.update(id,updateDescuentoDto);
    }

    @Delete('/eliminar/:id')
    delete(@Param('id') id: string){
        return this.descuentoService.delete(id);
    }
    
}
