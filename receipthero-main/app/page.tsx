"use client";

import type React from "react";
import { UploadedFile } from "../lib/types";
import { useReceiptManager } from "../lib/useReceiptManager";
import UploadReceiptPage from "../components/UploadReceiptPage";
import ResultsPage from "../components/ResultsPage";
import { useToast } from "../ui/toast";

export default function HomePage() {
  const { addToast } = useToast();
  const {
    receipts,
    breakdown,
    isProcessing,
    isLoaded,
    hasData,
    addReceipts,
    processFiles,
    selectFiles,
    startProcessing,
    deleteReceipt,
    clearAll,
  } = useReceiptManager();

  const handleProcessFiles = async (uploadedFiles: UploadedFile[]) => {
    const result = await addReceipts(uploadedFiles);

    // Show toast message for duplicates
    if (result.duplicatesCount > 0) {
      addToast(
        `${result.duplicatesCount} duplicate receipt${
          result.duplicatesCount > 1 ? "s" : ""
        } ${result.duplicatesCount > 1 ? "were" : "was"} skipped`,
        "warning"
      );
    }

    // Show success message if new receipts were added
    const newReceiptsCount = result.receipts.length - receipts.length;
    if (newReceiptsCount > 0) {
      addToast(
        `Successfully added ${newReceiptsCount} new receipt${
          newReceiptsCount > 1 ? "s" : ""
        }!`,
        "success"
      );
    }
  };

  const handleAddMoreReceipts = async () => {
    const files = await selectFiles();
    if (files.length > 0) {
      // Start processing only after files are actually selected
      startProcessing();
      // Process files first, then add receipts
      const processedFiles = await processFiles(files);
      const result = await addReceipts(processedFiles);

      // Show toast message for duplicates
      if (result.duplicatesCount > 0) {
        addToast(
          `${result.duplicatesCount} duplicate receipt${
            result.duplicatesCount > 1 ? "s" : ""
          } ${result.duplicatesCount > 1 ? "were" : "was"} skipped`,
          "warning"
        );
      }

      // Show success message if new receipts were added
      const newReceiptsCount = result.receipts.length - receipts.length;
      if (newReceiptsCount > 0) {
        addToast(
          `Successfully added ${newReceiptsCount} new receipt${
            newReceiptsCount > 1 ? "s" : ""
          }!`,
          "success"
        );
      }
    }
    // If no files selected, don't start processing at all
  };

  const handleDeleteReceipt = (receiptId: string) => {
    deleteReceipt(receiptId);
  };

  const handleStartOver = () => {
    clearAll();
  };

  // Show loading state while data is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your receipts...</p>
        </div>
      </div>
    );
  }

  if (hasData && breakdown) {
    return (
      <ResultsPage
        processedReceipts={receipts}
        spendingBreakdown={breakdown}
        onAddMoreReceipts={handleAddMoreReceipts}
        onDeleteReceipt={handleDeleteReceipt}
        onStartOver={handleStartOver}
        isProcessing={isProcessing}
      />
    );
  }

  return (
    <UploadReceiptPage
      onProcessFiles={handleProcessFiles}
      processFiles={processFiles}
    />
  );
}
