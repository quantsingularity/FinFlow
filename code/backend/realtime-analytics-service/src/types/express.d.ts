// Extend Express Request type to include the authenticated user.
declare namespace Express {
  export interface User {
    id: string;
    [key: string]: any;
  }

  export interface Request {
    user?: User;
  }
}
