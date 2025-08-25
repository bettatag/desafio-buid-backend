import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsIn,
  IsUrl,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class ProxyDto {
  @IsString()
  @IsNotEmpty()
    host: string;

  @IsString()
  @IsNotEmpty()
    port: string;

  @IsIn(['http', 'https'])
    protocol: 'http' | 'https';

  @IsString()
  @IsNotEmpty()
    username: string;

  @IsString()
  @IsNotEmpty()
    password: string;
}

export class CreateEvolutionInstanceDto {
  @IsString()
  @IsNotEmpty()
    instanceName: string;

  @IsString()
  @IsNotEmpty()
    token: string;

  @IsBoolean()
    qrcode: boolean;

  @IsString()
  @IsNotEmpty()
    number: string;

  @IsIn(['WHATSAPP-BAILEYS'])
    integration: 'WHATSAPP-BAILEYS';

  @IsUrl()
    webhook: string;

  @IsBoolean()
    webhook_by_events: boolean;

  @IsArray()
  @IsString({ each: true })
    events: string[];

  @IsBoolean()
    reject_call: boolean;

  @IsString()
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
  @IsString({ each: true })
    websocket_events: string[];

  @ValidateNested()
  @Type(() => ProxyDto)
    proxy: ProxyDto;
}
