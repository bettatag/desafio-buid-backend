export class EvolutionInstanceEntity {
  constructor(
    public readonly instance: {
      instanceName: string;
      instanceId: string;
      webhook_wa_business: string | null;
      access_token_wa_business: string;
      status: string;
    },
    public readonly hash: {
      apikey: string;
    },
    public readonly settings: {
      reject_call: boolean;
      msg_call: string;
      groups_ignore: boolean;
      always_online: boolean;
      read_messages: boolean;
      read_status: boolean;
      sync_full_history: boolean;
    },
  ) {}

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
