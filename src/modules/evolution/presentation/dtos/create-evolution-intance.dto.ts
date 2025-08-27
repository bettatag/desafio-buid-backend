import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsArray, IsEnum, ValidateNested } from 'class-validator';

class ProxyDto {
  @IsString()
    host: string;

  @IsString()
    port: string;

  @IsEnum(['http', 'https'])
    protocol: 'http' | 'https';

  @IsString()
    username: string;

  @IsString()
    password: string;
}

export class CreateInstanceDto {
  @IsString()
    instanceName: string;

  @IsString()
    token: string;

  @IsBoolean()
    qrcode: boolean;

  @IsString()
    number: string;

  @IsEnum(['WHATSAPP-BAILEYS'])
    integration: 'WHATSAPP-BAILEYS';

  @IsString()
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
