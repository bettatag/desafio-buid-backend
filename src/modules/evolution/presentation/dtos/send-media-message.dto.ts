import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

class MediaOptionsDto {
  @ApiProperty({
    description: 'Delay em milissegundos antes de enviar a mensagem',
    example: 1200,
    required: false,
  })
  @IsOptional()
  delay?: number;

  @ApiProperty({
    description: 'Presença a ser exibida durante o envio',
    enum: ['composing', 'recording', 'paused'],
    example: 'recording',
    required: false,
  })
  @IsOptional()
  @IsString()
  presence?: 'composing' | 'recording' | 'paused';
}

export class SendMediaMessageDto {
  @ApiProperty({
    description: 'Número do destinatário (com código do país)',
    example: '5511999999999',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'URL da mídia a ser enviada',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  mediaUrl: string;

  @ApiProperty({
    description: 'Tipo da mídia',
    enum: ['image', 'video', 'audio', 'document'],
    example: 'image',
  })
  @IsString()
  @IsNotEmpty()
  mediaType: 'image' | 'video' | 'audio' | 'document';

  @ApiProperty({
    description: 'Legenda para a mídia (opcional)',
    example: 'Esta é uma imagem interessante!',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    description: 'Nome do arquivo (para documentos)',
    example: 'documento.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({
    description: 'Opções adicionais para envio da mídia',
    type: MediaOptionsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaOptionsDto)
  options?: MediaOptionsDto;
}

