export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED" | "TRIAL";
  settings?: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
  // Persistence-layer (snake_case) and extended fields populated from the
  // tenant store. Optional because not every code path sets them.
  domain?: string;
  subdomain?: string;
  tier?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, unknown>;
  billing_info?: Record<string, unknown>;
  subscription_info?: Record<string, unknown>;
  isolation_type?: string;
}

export interface TenantSettings {
  tenantId: string;
  maxUsers: number;
  maxStorageGb: number;
  features: string[];
  customDomain?: string;
  ssoEnabled: boolean;
  mfaRequired: boolean;
  ipWhitelist?: string[];
  dataRetentionDays: number;
  webhookUrl?: string;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
  lastActiveAt?: Date;
}

export interface TenantAnalytics {
  tenantId: string;
  activeUsers: number;
  totalUsers: number;
  storageUsedGb: number;
  apiCallsThisMonth: number;
  lastActivityAt?: Date;
  period: { start: Date; end: Date };
}

export interface TenantCreationRequest {
  name: string;
  slug: string;
  plan: string;
  adminEmail: string;
  adminName?: string;
  settings?: Partial<TenantSettings>;
  subdomain?: string;
  domain?: string;
  tier?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
  billing_info?: Record<string, unknown>;
  subscription_info?: Record<string, unknown>;
  isolation_type?: string;
}

export interface TenantUpdateRequest {
  name?: string;
  plan?: string;
  status?: Tenant["status"];
  settings?: Partial<TenantSettings>;
  domain?: string;
  tier?: string;
  metadata?: Record<string, unknown>;
  billing_info?: Record<string, unknown>;
  subscription_info?: Record<string, unknown>;
  updated_by?: string;
}

export interface TenantSubscription {
  id: string;
  tenantId: string;
  plan: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

export interface TenantBilling {
  tenantId: string;
  currentBalance: number;
  currency: string;
  nextInvoiceDate?: Date;
  nextInvoiceAmount?: number;
  paymentMethod?: { type: string; last4?: string; brand?: string };
}
