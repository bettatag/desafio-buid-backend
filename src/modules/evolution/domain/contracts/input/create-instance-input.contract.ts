export type ICreateInstanceInput = {
  instanceName: string;
  token: string;
  qrcode: boolean;
  number: string;
  integration: 'WHATSAPP-BAILEYS';
  webhook: string;
  webhook_by_events: boolean;
  events: string[];
  reject_call: boolean;
  msg_call: string;
  groups_ignore: boolean;
  always_online: boolean;
  read_messages: boolean;
  read_status: boolean;
  websocket_enabled: boolean;
  websocket_events: string[];
  proxy: {
    host: string;
    port: string;
    protocol: 'http' | 'https';
    username: string;
    password: string;
  };
};
