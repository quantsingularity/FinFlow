export enum DataIsolationStrategy {
  SHARED_DATABASE = "SHARED_DATABASE",
  SHARED_SCHEMA = "SHARED_SCHEMA",
  ISOLATED_DATABASE = "ISOLATED_DATABASE",
  ISOLATED_SCHEMA = "ISOLATED_SCHEMA",
}

export interface IsolationStrategyDescriptor {
  type: string;
  description: string;
  implementation: string;
  security_level: string;
  performance_impact: string;
  complexity: string;
}

export interface TenantDataAccess {
  tenantId: string;
  schemaName?: string;
  databaseName?: string;
  connectionString?: string;
  isolationStrategy: DataIsolationStrategy;
}

export interface BulkOperation {
  operationId: string;
  tenantId: string;
  operationType: string;
  data: any[];
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface DataExportOptions {
  tenantId: string;
  format: "JSON" | "CSV" | "XLSX";
  entities?: string[];
  startDate?: Date;
  endDate?: Date;
  includeMetadata?: boolean;
}

export interface DataValidationRule {
  field: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface DataEncryption {
  tenantId: string;
  algorithm: string;
  keyId: string;
  encryptedFields: string[];
}
