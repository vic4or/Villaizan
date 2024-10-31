import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';

@Controller('combo')
export class ComboController {

    constructor(private readonly comboService: ComboService) {}

    @Get('/listarTodos')
    findAll(){
        return this.comboService.findAll();
    }

    @Get('/listarUno/:id')
    findOne(id: string){
        return this.comboService.findOne(id);
    }

    @Post('/registrar')
    create(@Body() createComboDto: CreateComboDto){
        return this.comboService.create(createComboDto);
    }

    @Patch('/editar/:id')
    update(@Param('id') id:string, @Body() updateComboDto: UpdateComboDto){
        return this.comboService.update(id,updateComboDto);
    }

    @Delete('/eliminar/:id')
    delete(@Param('id') id: string){
        return this.comboService.delete(id);
    }

}
