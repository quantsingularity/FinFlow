// Extend Express Request with the authenticated user and resolved tenant.
declare namespace Express {
  export interface User {
    id: string;
    [key: string]: any;
  }
  export interface Request {
    user?: User;
    tenant?: { id: string; [key: string]: any };
  }
}
