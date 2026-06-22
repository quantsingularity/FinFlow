// Ambient declaration for the Square SDK.
//
// The code imports from "square" and the test suite maps it to a manual mock,
// but the package is not listed in package.json dependencies, so the build
// cannot resolve it. This declaration unblocks the build. The correct fix is
// to add the actual "square" SDK to package.json dependencies. See FIXES.md.
declare module "square" {
  export class Client {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class ApiError extends Error {
    [key: string]: any;
  }
  export const Environment: any;
  export type ApiResponse<T = any> = any;
}
