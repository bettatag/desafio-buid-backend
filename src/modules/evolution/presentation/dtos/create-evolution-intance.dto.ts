import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
  Length,
  IsUrl,
  IsNotEmpty,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';

class ProxyDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  host: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5)
  port: string;

  @IsEnum(['http', 'https'])
  protocol: 'http' | 'https';

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  password: string;
}

export class CreateEvolutionInstanceDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  instanceName: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  token: string;

  @IsBoolean()
  qrcode: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  number: string;

  @IsEnum(['WHATSAPP-BAILEYS'])
  integration: 'WHATSAPP-BAILEYS';

  @IsString()
  @IsUrl()
  @MaxLength(500)
  webhook: string;

  @IsBoolean()
  webhook_by_events: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  events: string[];

  @IsBoolean()
  reject_call: boolean;

  @IsString()
  @MaxLength(500)
  msg_call: string;

  @IsBoolean()
  groups_ignore: boolean;

  @IsBoolean()
  always_online: boolean;

  @IsBoolean()
  read_messages: boolean;

  @IsBoolean()
  read_status: boolean;

  @IsBoolean()
  websocket_enabled: boolean;

  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  websocket_events: string[];

  @ValidateNested()
  @Type(() => ProxyDto)
  proxy: ProxyDto;
}
