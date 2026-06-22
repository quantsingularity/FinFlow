// Extend Express Request type to include the authenticated user payload.
// The JWT subject claim (`sub`) carries the user id used by controllers.
declare namespace Express {
  export interface User {
    sub: string;
    [key: string]: any;
  }

  export interface Request {
    user?: User;
  }
}
