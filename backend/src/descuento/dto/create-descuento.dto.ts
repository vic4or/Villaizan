
export class CreateDescuentoDto {
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    limiteStock: number;
    porcentajeDescuento: number;
    vi_productoIds: string[];
}