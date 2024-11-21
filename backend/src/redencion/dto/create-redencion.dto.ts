import { CreateDetalleRedencionDto } from './create-detalle-redencion.dto';

export class CreateRedencionDto {
  id_usuario: string;
  puntoscanjeado: number;
  codigo: string;
  //usuariocreacion: string;
  detalles: CreateDetalleRedencionDto[];
}
