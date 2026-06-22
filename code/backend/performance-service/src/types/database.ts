export interface QueryOptimization {
  queryId: string;
  originalQuery: string;
  optimizedQuery?: string;
  estimatedImprovement: number;
  suggestions: string[];
  appliedAt?: Date;
}

export interface IndexImpactAnalysis {
  currentCost: number;
  estimatedCost: number;
  affectedQueries: number;
  storageOverhead: number;
}

export interface IndexRecommendation {
  tableName: string;
  columnNames: string[];
  indexType: "btree" | "hash" | "gin" | "gist";
  estimatedBenefit: number;
  queryPatterns: string[];
  status: "pending" | "applied" | "rejected";
  impactAnalysis: IndexImpactAnalysis;
}

export interface PartitionStrategy {
  table: string;
  partitionKey: string;
  partitionType: "RANGE" | "LIST" | "HASH";
  partitions: PartitionDefinition[];
}

export interface PartitionDefinition {
  name: string;
  bound: string | number;
}

export interface DatabaseStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  databaseSize: string;
  databaseSizeBytes: number;
  slowQueryCount: number;
  cacheHitRatio: number;
  totalIndexes: number;
  usedIndexes: number;
  indexUsageRatio: number;
  tableCount?: number;
  indexCount?: number;
  avgQueryTime?: number;
  collectedAt?: Date;
}

export interface QueryPerformance {
  queryId: string;
  query: string;
  queryHash?: string;
  queryText?: string;
  executionTime: number;
  averageExecutionTime?: number;
  rowsAffected: number;
  timestamp: Date;
  parameters?: any[];
  planningTime?: number;
  isSlowQuery: boolean;
}

export interface ConnectionPoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingClients: number;
  maxConnections: number;
  minConnections?: number;
}

export interface OptimizationResult {
  type: string;
  description: string;
  estimatedBenefit: number;
  actualBenefit: number;
  duration: number;
  success: boolean;
  error?: string;
}
