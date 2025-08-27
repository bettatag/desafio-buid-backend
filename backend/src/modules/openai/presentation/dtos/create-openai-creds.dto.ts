import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateOpenAICredsDto {
  @ApiProperty({
    description: 'Nome das credenciais OpenAI',
    example: 'main-openai-creds',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Chave da API OpenAI',
    example: 'sk-proj-vxzixTRvq1234567890abcdef...',
  })
  @IsString()
  apiKey: string;

  @ApiProperty({
    description: 'ID da organização OpenAI (opcional)',
    example: 'org-abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({
    description: 'Status das credenciais (ativa/inativa)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
