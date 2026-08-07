import config from "../../../common/config";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../auth.types";

export const generateToken = (
  userId: string,
  role: string,
  expiresIn: string = config.jwt.expiresIn,
): string => {
  return jwt.sign({ sub: userId, role }, config.jwt.secret, {
    expiresIn,
  } as any);
};

export const verifyToken = (token: string): TokenPayload => {
  // BUG FIX (security hardening): jwt.verify() was called without an explicit
  // `algorithms` allowlist. jsonwebtoken infers the algorithm from the token's
  // own header when none is specified, so an attacker-supplied token could
  // request any algorithm the library supports rather than being pinned to
  // the HS256 algorithm this service actually signs with (see generateToken
  // above). Pinning algorithms defends against algorithm-confusion/downgrade
  // attacks even though this service only uses a single symmetric secret
  // today. Applied consistently to every jwt.verify() call across the
  // backend (analytics/auth/accounting/payments app.ts, auth.service.ts,
  // and the integration/multi-tenant/realtime-analytics auth middlewares).
  return jwt.verify(token, config.jwt.secret, {
    algorithms: ["HS256"],
  }) as TokenPayload;
};

export default { generateToken, verifyToken };
