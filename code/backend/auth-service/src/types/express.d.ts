// Extend Express Request type to include the authenticated user.
// The user is attached by the JWT passport strategy and carries the
// fields the authorization middleware relies on (id, email, role).
declare namespace Express {
  export interface User {
    id: string;
    email: string;
    role: string;
    [key: string]: any;
  }

  export interface Request {
    user?: User;
  }
}
