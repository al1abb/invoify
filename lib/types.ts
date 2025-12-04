import { z } from "zod";

// Schema for a processed receipt
export const ProcessedReceiptSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  date: z.string(),
  vendor: z.string(),
  category: z.string(),
  paymentMethod: z.string(),
  taxAmount: z.number(),
  amount: z.number(),
  currency: z.string().default('USD'),
  originalAmount: z.number().optional(),
  originalTaxAmount: z.number().optional(),
  exchangeRate: z.number().optional(),
  thumbnail: z.string(),
  base64: z.string(),
  mimeType: z.string(),
});

// Type exports
export type ProcessedReceipt = z.infer<typeof ProcessedReceiptSchema>;

// Storage-optimized version without large base64 data
export interface StoredReceipt {
  id: string;
  fileName: string;
  date: string;
  vendor: string;
  category: string;
  paymentMethod: string;
  taxAmount: number;
  amount: number;
  currency?: string;
  originalAmount?: number;
  originalTaxAmount?: number;
  exchangeRate?: number;
  mimeType: string;
}

// Status for uploaded files
export type FileStatus = 'processing' | 'receipt' | 'not-receipt' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  file: File;
  status: FileStatus;
  receipt?: ProcessedReceipt;
  /** Error message - only present when status === 'error' */
  error?: string;
  base64?: string;
  mimeType?: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface SpendingBreakdown {
  categories: SpendingCategory[];
}