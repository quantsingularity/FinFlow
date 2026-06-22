export interface QuickBooksConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  environment?: "sandbox" | "production";
  companyId?: string;
  [key: string]: any;
}

export interface QuickBooksTokens {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  xRefreshTokenExpiresIn?: number;
  idToken?: string;
  createdAt?: Date;
  [key: string]: any;
}

export interface QuickBooksCompany {
  id?: string;
  name?: string;
  legalName?: string;
  country?: string;
  currency?: string;
  fiscalYearStart?: string;
  [key: string]: any;
}

export interface QuickBooksCustomer {
  id?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  balance?: number;
  active?: boolean;
  [key: string]: any;
}

export interface QuickBooksInvoice {
  id?: string;
  docNumber?: string;
  customerId?: string;
  totalAmount?: number;
  balance?: number;
  dueDate?: string;
  status?: string;
  lineItems?: any[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface QuickBooksPayment {
  id?: string;
  customerId?: string;
  totalAmount?: number;
  currency?: string;
  paymentMethodRef?: string;
  depositToAccountRef?: string;
  transactionDate?: string;
  [key: string]: any;
}

export interface QuickBooksItem {
  id?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  type?: string;
  active?: boolean;
  [key: string]: any;
}

export interface QuickBooksAccount {
  id?: string;
  name?: string;
  accountType?: string;
  accountSubType?: string;
  currentBalance?: number;
  currency?: string;
  active?: boolean;
  [key: string]: any;
}

export interface QuickBooksTransaction {
  id?: string;
  txnDate?: string;
  amount?: number;
  type?: string;
  description?: string;
  accountId?: string;
  [key: string]: any;
}

export interface QuickBooksSyncResult {
  success?: boolean;
  entityType?: string;
  synced?: number;
  failed?: number;
  errors?: any[];
  lastSyncAt?: Date;
  [key: string]: any;
}
