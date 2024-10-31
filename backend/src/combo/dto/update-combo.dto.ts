import { CreateComboDto } from "./create-combo.dto"
import { PartialType } from "@nestjs/mapped-types"

export class UpdateComboDto extends PartialType(CreateComboDto) {}