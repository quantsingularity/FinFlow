// Extend Express Request type to include the authenticated user payload.
// The JWT strategy attaches the decoded token, whose subject claim (`sub`)
// carries the user id used by the forecast controller.
declare namespace Express {
  export interface User {
    sub: string;
    [key: string]: any;
  }

  export interface Request {
    user?: User;
  }
}
