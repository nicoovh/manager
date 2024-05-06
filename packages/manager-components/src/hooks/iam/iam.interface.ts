export interface IamInterface {
  page?: string;
  urns?: string[];
  actions?: string[];
  isTrigger?: boolean;
  pageIndex?: number | string;
}

export interface PageInterface {
  authorizedActions: string[];
  unauthorizedActions?: string[];
  resourceURN?: string;
}

export interface PageReduceIam {
  [key: string]: PageInterface;
}
