export type EvolutionInstanceEntity = {
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
};
