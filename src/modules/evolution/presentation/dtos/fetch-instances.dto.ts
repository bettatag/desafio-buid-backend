import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class FetchInstancesDto {
  @ApiPropertyOptional({
    description: 'Nome da instância para filtrar',
    example: 'minha-instancia',
  })
  @IsOptional()
  @IsString()
  instanceName?: string;

  @ApiPropertyOptional({
    description: 'Status da instância para filtrar',
    enum: ['ACTIVE', 'INACTIVE', 'CONNECTING', 'DISCONNECTED'],
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'CONNECTING', 'DISCONNECTED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'CONNECTING' | 'DISCONNECTED';
}
