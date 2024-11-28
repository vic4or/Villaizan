import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ContenidoEducativoService } from './contenidoeducativo.service';

@Controller('contenidoeducativo')
export class ContenidoEducativoController {
  constructor(private readonly contenidoeducativoService: ContenidoEducativoService) {}

  // Obtener todos los contenidos educativos
  @Get('/listarTodos')
  async getAllContenidosEducativos() {
    return this.contenidoeducativoService.getAllContenidosEducativos();
  }

  // Obtener un contenido educativo por ID
  @Get('/listarUno/:id')
  async getContenidoEducativoById(@Param('id', ParseIntPipe) id: number) {
    return this.contenidoeducativoService.getContenidoEducativoById(id);
  }

  // Crear un nuevo contenido educativo
  @Post('/registrar')
  async crearContenidoEducativo(
    @Body('id_fruta') id_fruta: string,
    @Body('titulo') titulo: string,
    @Body('contenidoinformacion') contenidoinformacion: string,
    @Body('tipocontenido') tipocontenido: string,
    @Body('urlcontenido') urlcontenido: string,
  ) {
    return this.contenidoeducativoService.createContenidoEducativo({
      id_fruta,
      titulo,
      contenidoinformacion: tipocontenido === 'Información' ? contenidoinformacion : undefined,
      tipocontenido,
      urlcontenido: tipocontenido !== 'Información' ? urlcontenido : undefined,
    });
  }

  // Editar un contenido educativo
  @Put('/editar/:id')
  async editarContenidoEducativo(
    @Param('id', ParseIntPipe) id: number,
    @Body('titulo') titulo: string,
    @Body('contenidoinformacion') contenidoinformacion: string,
    @Body('tipocontenido') tipocontenido: string,
    @Body('urlcontenido') urlcontenido: string,
    @Body('id_fruta') id_fruta: string,
  ) {
    return this.contenidoeducativoService.updateContenidoEducativo(id, {
      titulo,
      contenidoinformacion: tipocontenido === 'Información' ? contenidoinformacion : undefined,
      tipocontenido,
      urlcontenido: tipocontenido !== 'Información' ? urlcontenido : undefined,
      id_fruta,
    });
  }

  // Desactivar un contenido educativo
  @Put('/inactivar/:id')
  async inactivarContenidoEducativo(@Param('id', ParseIntPipe) id: number) {
    return this.contenidoeducativoService.inactivateContenidoEducativo(id);
  }
}
