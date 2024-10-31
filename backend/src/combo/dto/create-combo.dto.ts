export class CreateComboDto {
    titulo: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    limiteStock: number;
    precio: number;
    productos: {
      producto_id: string; // ID del producto
      cantidad: number; // Cantidad del producto en el combo
    }[];
  }