import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class OptionsDto {
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
    example: 'composing',
    required: false,
  })
  @IsOptional()
  @IsString()
  presence?: 'composing' | 'recording' | 'paused';
}

export class SendTextMessageDto {
  @ApiProperty({
    description: 'Número do destinatário (com código do país)',
    example: '5511999999999',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'Texto da mensagem a ser enviada',
    example: 'Olá! Esta é uma mensagem de teste.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Opções adicionais para envio da mensagem',
    type: OptionsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto;

  @ApiProperty({
    description: 'Indica se deve citar uma mensagem específica',
    required: false,
  })
  @IsOptional()
  @IsString()
  quoted?: string;

  @ApiProperty({
    description: 'Lista de menções (JIDs dos usuários)',
    type: [String],
    example: ['5511888888888@s.whatsapp.net'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];
}

