import { ApiProperty } from '@nestjs/swagger';

export class EvolutionInstanceEntity {
  @ApiProperty({
    description: 'Informações da instância',
    type: 'object',
    properties: {
      instanceName: { type: 'string', example: 'minha-instancia' },
      instanceId: { type: 'string', example: 'uuid-da-instancia' },
      webhook_wa_business: {
        type: 'string',
        nullable: true,
        example: 'https://seu-webhook.com/callback',
      },
      access_token_wa_business: { type: 'string', example: 'token-de-acesso' },
      status: { type: 'string', example: 'ACTIVE' },
    },
  })
  public readonly instance: {
    instanceName: string;
    instanceId: string;
    webhook_wa_business: string | null;
    access_token_wa_business: string;
    status: string;
  };

  @ApiProperty({
    description: 'Hash de autenticação',
    type: 'object',
    properties: {
      apikey: { type: 'string', example: 'chave-api-gerada' },
    },
  })
  public readonly hash: {
    apikey: string;
  };

  @ApiProperty({
    description: 'Configurações da instância',
    type: 'object',
    properties: {
      reject_call: { type: 'boolean', example: false },
      msg_call: { type: 'string', example: 'Chamadas não são aceitas' },
      groups_ignore: { type: 'boolean', example: false },
      always_online: { type: 'boolean', example: true },
      read_messages: { type: 'boolean', example: true },
      read_status: { type: 'boolean', example: true },
      sync_full_history: { type: 'boolean', example: false },
    },
  })
  public readonly settings: {
    reject_call: boolean;
    msg_call: string;
    groups_ignore: boolean;
    always_online: boolean;
    read_messages: boolean;
    read_status: boolean;
    sync_full_history: boolean;
  };

  constructor(
    instance: {
      instanceName: string;
      instanceId: string;
      webhook_wa_business: string | null;
      access_token_wa_business: string;
      status: string;
    },
    hash: {
      apikey: string;
    },
    settings: {
      reject_call: boolean;
      msg_call: string;
      groups_ignore: boolean;
      always_online: boolean;
      read_messages: boolean;
      read_status: boolean;
      sync_full_history: boolean;
    },
  ) {
    this.instance = instance;
    this.hash = hash;
    this.settings = settings;
  }

  // Métodos de negócio
  isActive(): boolean {
    return this.instance.status === 'ACTIVE';
  }

  getInstanceInfo(): string {
    return `${this.instance.instanceName} (${this.instance.instanceId})`;
  }

  canReceiveCalls(): boolean {
    return !this.settings.reject_call;
  }

  isAlwaysOnline(): boolean {
    return this.settings.always_online;
  }

  hasValidWebhook(): boolean {
    return (
      !!this.instance.webhook_wa_business && this.instance.webhook_wa_business.trim().length > 0
    );
  }

  canReadMessages(): boolean {
    return this.settings.read_messages;
  }

  canReadStatus(): boolean {
    return this.settings.read_status;
  }

  shouldIgnoreGroups(): boolean {
    return this.settings.groups_ignore;
  }

  getCallRejectionMessage(): string {
    return this.settings.msg_call || 'Chamadas não são aceitas nesta instância';
  }

  isValid(): boolean {
    return (
      !!this.instance.instanceName?.trim() &&
      !!this.instance.instanceId?.trim() &&
      !!this.instance.access_token_wa_business?.trim() &&
      !!this.hash.apikey?.trim()
    );
  }

  static create(data: {
    instance: {
      instanceName: string;
      instanceId: string;
      webhook_wa_business: string | null;
      access_token_wa_business: string;
      status: string;
    };
    hash: {
      apikey: string;
    };
    settings: {
      reject_call: boolean;
      msg_call: string;
      groups_ignore: boolean;
      always_online: boolean;
      read_messages: boolean;
      read_status: boolean;
      sync_full_history: boolean;
    };
  }): EvolutionInstanceEntity {
    return new EvolutionInstanceEntity(data.instance, data.hash, data.settings);
  }
}
