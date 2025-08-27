import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeStatusDto {
  @ApiProperty({
    description: 'Novo status do bot (ativo/inativo)',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;
}
