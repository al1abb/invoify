import { useState, useEffect, useCallback } from 'react';
import { ProcessedReceipt, StoredReceipt, SpendingBreakdown, UploadedFile, FileStatus } from './types';
import { normalizeDate } from './utils';
import { getMultipleUSDConversionRates } from './currency';
import { useToast } from '@/app/components/receipt-organizer/ui/toast';

interface StoredData {
  receipts: StoredReceipt[];
  breakdown: SpendingBreakdown | null;
}

const STORAGE_KEY = 'receipt-hero-data';

const readFileAsBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [mimePart, base64] = result.split(',');
      const mimeType = mimePart.split(':')[1].split(';')[0];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Simple hash function for base64 content
const hashBase64 = (base64: string): string => {
  let hash = 0;
  for (let i = 0; i < base64.length; i++) {
    const char = base64.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Resize image to thumbnail size (335x403)
const createThumbnail = (base64: string, maxWidth: number = 335, maxHeight: number = 403): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnailBase64);
    };
    img.src = base64;
  });
};

// Convert ProcessedReceipt to StoredReceipt (keep thumbnail, remove full base64)
const toStoredReceipt = (receipt: ProcessedReceipt): StoredReceipt => ({
  id: receipt.id,
  fileName: receipt.fileName,
  date: receipt.date,
  vendor: receipt.vendor,
  category: receipt.category,
  paymentMethod: receipt.paymentMethod,
  taxAmount: receipt.taxAmount,
  amount: receipt.amount,
  currency: receipt.currency,
  originalAmount: receipt.originalAmount,
  originalTaxAmount: receipt.originalTaxAmount,
  exchangeRate: receipt.exchangeRate,
  mimeType: receipt.mimeType,
});

// Convert StoredReceipt to ProcessedReceipt (load thumbnail from separate storage)
const fromStoredReceipt = async (stored: StoredReceipt): Promise<ProcessedReceipt> => {
  const thumbnailKey = `receipt-hero-thumbnail-${stored.id}`;
  const thumbnail = localStorage.getItem(thumbnailKey) || '/placeholder.svg';

  return {
    ...stored,
    currency: (stored.currency || 'USD').toUpperCase(), // Default to USD for backward compatibility
    originalAmount: stored.originalAmount,
    originalTaxAmount: stored.originalTaxAmount,
    exchangeRate: stored.exchangeRate,
    thumbnail,
    base64: '', // Keep empty since we don't store full images
  };
};

export function useReceiptManager() {
  const [receipts, setReceipts] = useState<ProcessedReceipt[]>([]);
  const [breakdown, setBreakdown] = useState<SpendingBreakdown | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToast } = useToast();



  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: StoredData = JSON.parse(stored);
          const fullReceipts = await Promise.all(
            (data.receipts || []).map(fromStoredReceipt)
          );
          setReceipts(fullReceipts);
          setBreakdown(data.breakdown || null);
        }
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveToStorage = useCallback(async (receipts: ProcessedReceipt[], breakdown: SpendingBreakdown | null) => {
    try {
      // Save thumbnails separately
      for (const receipt of receipts) {
        if (receipt.thumbnail && receipt.thumbnail !== '/placeholder.svg' && !receipt.thumbnail.startsWith('/')) {
          const thumbnailKey = `receipt-hero-thumbnail-${receipt.id}`;
          localStorage.setItem(thumbnailKey, receipt.thumbnail);
        }
      }

      // Save metadata
      const storedReceipts = receipts.map(toStoredReceipt);
      const data: StoredData = { receipts: storedReceipts, breakdown };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, []);

  // Calculate spending breakdown
  const calculateBreakdown = useCallback((receipts: ProcessedReceipt[]): SpendingBreakdown => {
    const categoryTotals = receipts.reduce((acc, receipt) => {
      acc[receipt.category] = (acc[receipt.category] || 0) + receipt.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpending = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

    const categories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / totalSpending) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      categories,
    };
  }, []);

  // Process files through OCR API (parallel processing)
  const processFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    // First, process all files to get OCR data
    const filePromises = files.map(async (file) => {
      try {
        const { base64, mimeType } = await readFileAsBase64(file);
        const fileId = hashBase64(base64); // Use content-based ID

        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Image: base64 }),
        });

        const data = await response.json();

        // Handle rate limit error specifically
        if (response.status === 429) {
          addToast(data.details || "You've reached the daily limit of 40 receipts. Contact @nutlope on X/Twitter for higher limits.", 'warning', 10000); // Show for 10 seconds
          return {
            id: fileId,
            name: file.name,
            file,
            status: 'error' as FileStatus,
            error: 'Rate limit exceeded',
            base64,
            mimeType,
          };
        }

        if (response.ok && data.receipts && data.receipts.length > 0) {
          const receipt = data.receipts[0]; // Take first receipt if multiple
          const receiptId = hashBase64(base64);

          // Create thumbnail from the full image
          const fullImageBase64 = `data:${mimeType};base64,${base64}`;
          const thumbnail = await createThumbnail(fullImageBase64);

          return {
            id: fileId,
            name: file.name,
            file,
            status: 'receipt' as FileStatus,
            receipt: {
              ...receipt,
              id: receiptId,
              fileName: receipt.fileName || file.name,
              date: normalizeDate(receipt.date),
              currency: (receipt.currency || 'USD').toUpperCase(),
              thumbnail,
              base64: '', // Don't store full image to save space
              mimeType,
            },
            base64,
            mimeType,
            rawReceipt: receipt, // Keep original for currency conversion
          };
        } else {
          // No receipt data found
          return {
            id: fileId,
            name: file.name,
            file,
            status: 'not-receipt' as FileStatus,
            base64,
            mimeType,
          };
        }
      } catch (error) {
        console.error('Error processing file:', error);
        const { base64 } = await readFileAsBase64(file);
        const fileId = hashBase64(base64);
        return {
          id: fileId,
          name: file.name,
          file,
          status: 'error' as FileStatus,
          error: error instanceof Error ? error.message : 'Processing failed',
          base64: '',
          mimeType: file.type,
        };
      }
    });

    const results = await Promise.all(filePromises);

    // Now batch convert currencies for all successful receipts
    const receiptsToConvert = results
      .filter(r => r.status === 'receipt' && r.receipt)
      .map(r => r.receipt!)
      .filter(receipt => receipt.currency !== 'USD');

    if (receiptsToConvert.length > 0) {
      try {
        // Get unique currencies
        const currencies = Array.from(new Set(receiptsToConvert.map(r => r.currency)));
        const conversionRates = await getMultipleUSDConversionRates(currencies);

        // Apply conversions
        for (const result of results) {
          if (result.status === 'receipt' && result.receipt) {
            const receipt = result.receipt;
            const currency = receipt.currency;

            if (currency !== 'USD' && conversionRates[currency]) {
              const conversionRate = conversionRates[currency];
              const originalAmount = result.rawReceipt?.amount || receipt.amount;
              const originalTaxAmount = result.rawReceipt?.taxAmount || receipt.taxAmount;

              receipt.amount = originalAmount / conversionRate;
              receipt.taxAmount = originalTaxAmount / conversionRate;
              receipt.originalAmount = originalAmount;
              receipt.originalTaxAmount = originalTaxAmount;
              receipt.exchangeRate = conversionRate;

              console.log(`✅ Converted ${originalAmount} ${currency} to ${receipt.amount.toFixed(2)} USD (rate: ${conversionRate})`);
            }
          }
        }
      } catch (error) {
        console.error('❌ Failed to convert currencies:', error);
        // Keep original amounts if conversion fails
      }
    }

    // Clean up rawReceipt data
    for (const result of results) {
      if (result.rawReceipt) {
        delete result.rawReceipt;
      }
    }

    return results;
  }, []);

  // Add new receipts (used by upload page)
  const addReceipts = useCallback(async (uploadedFiles: UploadedFile[]) => {
    setIsProcessing(true);

    try {
      // Filter only files that are receipts
      const receiptFiles = uploadedFiles
        .filter(file => file.status === 'receipt' && file.receipt)
        .map(file => file.receipt!);

      // Deduplicate based on ID (hash of base64 content)
      const newReceipts = receiptFiles.filter(newReceipt =>
        !receipts.some(existing => existing.id === newReceipt.id)
      );

      const duplicatesCount = receiptFiles.length - newReceipts.length;

      if (newReceipts.length === 0) {
        // No new receipts to add
        return { receipts, breakdown, duplicatesCount };
      }

       const updatedReceipts = [...receipts, ...newReceipts];
       const newBreakdown = calculateBreakdown(updatedReceipts);

       setReceipts(updatedReceipts);
       setBreakdown(newBreakdown);
       await saveToStorage(updatedReceipts, newBreakdown);

      return { receipts: updatedReceipts, breakdown: newBreakdown, duplicatesCount };
    } catch (error) {
      console.error('Failed to add receipts:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [receipts, breakdown, calculateBreakdown, saveToStorage]);

  // Delete a receipt
  const deleteReceipt = useCallback(async (receiptId: string) => {
    const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptId);

    // Remove thumbnail from localStorage
    const thumbnailKey = `receipt-hero-thumbnail-${receiptId}`;
    localStorage.removeItem(thumbnailKey);

    if (updatedReceipts.length === 0) {
      setReceipts([]);
      setBreakdown(null);
      await saveToStorage([], null);
    } else {
      const newBreakdown = calculateBreakdown(updatedReceipts);
      setReceipts(updatedReceipts);
      setBreakdown(newBreakdown);
      await saveToStorage(updatedReceipts, newBreakdown);
    }
  }, [receipts, calculateBreakdown, saveToStorage]);

  // Clear all data
  const clearAll = useCallback(() => {
    setReceipts([]);
    setBreakdown(null);

    // Remove main data
    localStorage.removeItem(STORAGE_KEY);

    // Remove all thumbnails
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('receipt-hero-thumbnail-')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Start processing state (for when user initiates file selection)
  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);



  // Get files from file input
  const selectFiles = useCallback((): Promise<File[]> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';

      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        resolve(files ? Array.from(files) : []);
      };

      input.click();
    });
  }, []);

  return {
    // State
    receipts,
    breakdown,
    isProcessing,
    isLoaded,
    hasData: receipts.length > 0 && breakdown !== null,

    // Actions
    processFiles,
    addReceipts,
    deleteReceipt,
    clearAll,
    selectFiles,
    startProcessing,
  };
}