import { CreateDescuentoDto } from "./create-descuento.dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateDescuentoDto extends PartialType(CreateDescuentoDto) {}