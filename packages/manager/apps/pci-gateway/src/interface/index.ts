export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export interface IPAddress {
  ip: string;
  type: string;
  version: number;
  networkId: string;
  gatewayIp: string | null;
}

export interface GatewayResponse {
  resources: Gateway[];
  errors: unknown[];
}
export interface Gateway {
  id: string;
  status: string;
  name: string;
  region: string;
  model: string;
  interfaces: Interface[];
  connectedNetworkCount: number;
  formattedIps: string;
  externalInformation: {
    ips: {
      ip: string;
      subnetId: string;
    }[];
    networkId: string;
  };
}

export interface Interface {
  id: string;
  ip: string;
  subnetId: string;
  networkId: string;
}
