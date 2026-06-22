// Interim ambient type surface for @prisma/client.
//
// This project depends on @prisma/client but ships no schema.prisma, so the
// client is never generated and the package resolves to an empty module. That
// caused the production `tsc` build to fail across every service even though
// the mock-based test suites pass.
//
// This declaration restores the minimal client surface the code actually uses
// (a connect/disconnect/transaction lifecycle plus permissive model delegates),
// which lets the build compile. The correct long-term fix is to add the real
// schema.prisma and wire `prisma generate` into the build. See FIXES.md.

declare module "@prisma/client" {
  type PrismaDelegate = {
    create: (args?: any) => Promise<any>;
    createMany: (args?: any) => Promise<{ count: number }>;
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (args?: any) => Promise<any | null>;
    findFirst: (args?: any) => Promise<any | null>;
    update: (args?: any) => Promise<any>;
    updateMany: (args?: any) => Promise<{ count: number }>;
    upsert: (args?: any) => Promise<any>;
    delete: (args?: any) => Promise<any>;
    deleteMany: (args?: any) => Promise<{ count: number }>;
    count: (args?: any) => Promise<number>;
    aggregate: (args?: any) => Promise<any>;
    groupBy: (args?: any) => Promise<any[]>;
  };

  export class PrismaClient {
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction(arg: any, options?: any): Promise<any>;
    $queryRaw(...args: any[]): Promise<any>;
    $queryRawUnsafe(...args: any[]): Promise<any>;
    $executeRaw(...args: any[]): Promise<any>;
    $executeRawUnsafe(...args: any[]): Promise<any>;
    $on(...args: any[]): void;
    $use(...args: any[]): void;

    user: PrismaDelegate;
    userPreference: PrismaDelegate;
    account: PrismaDelegate;
    journalEntry: PrismaDelegate;
    ledgerEntry: PrismaDelegate;
    invoice: PrismaDelegate;
    forecast: PrismaDelegate;
    payment: PrismaDelegate;
    transaction: PrismaDelegate;
    category: PrismaDelegate;
    tenant: PrismaDelegate;
    integration: PrismaDelegate;

    [model: string]: any;
  }

  export namespace Prisma {
    type TransactionClient = any;
    type PrismaClientKnownRequestError = any;
    const PrismaClientKnownRequestError: any;
    type JsonValue = any;
    type InputJsonValue = any;
    const Decimal: any;
    type Decimal = any;
  }
}
