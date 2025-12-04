"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UploadedFile } from "@/lib/types";

import Header from "./Header";
import { Tooltip } from "./ui/tooltip";

interface UploadReceiptPageProps {
  onProcessFiles: (uploadedFiles: UploadedFile[]) => Promise<void>;
  processFiles: (files: File[]) => Promise<UploadedFile[]>;
}

export default function UploadReceiptPage({
  onProcessFiles,
  processFiles,
}: UploadReceiptPageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const autoRedirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Auto-redirect logic: if all files are processed and user doesn't upload more within 5 seconds
  useEffect(() => {
    const allFilesProcessed =
      uploadedFiles.length > 0 &&
      uploadedFiles.every((f) => f.status !== "processing");
    const hasSuccessfulReceipts = uploadedFiles.some(
      (f) => f.status === "receipt" && f.receipt
    );

    if (allFilesProcessed && hasSuccessfulReceipts) {
      // Clear any existing timers
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      // Start countdown at 5 seconds
      setCountdown(5);

      // Start countdown timer (updates every second)
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            // Countdown finished, clear interval
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // Start main auto-redirect timer
      autoRedirectTimerRef.current = setTimeout(async () => {
        setCountdown(null);
        await handleAutoGenerateResults();
      }, 5000);
    } else {
      // Clear countdown if conditions are not met
      setCountdown(null);
    }

    // Cleanup timers on unmount or when files change
    return () => {
      if (autoRedirectTimerRef.current) {
        clearTimeout(autoRedirectTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [uploadedFiles]);

  // Clear timer when new files are uploaded
  const clearAutoRedirectTimer = () => {
    if (autoRedirectTimerRef.current) {
      clearTimeout(autoRedirectTimerRef.current);
      autoRedirectTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  const onDrop = (acceptedFiles: File[]) => {
    clearAutoRedirectTimer(); // Clear timer when new files are uploaded
    handleFileUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
  });

  const handleFileUpload = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID
      name: file.name,
      file,
      status: "processing" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Use the receipt manager's processFiles function
    try {
      const processedFiles = await processFiles(files);

      // Update all files at once with their processed results
      setUploadedFiles((prev) =>
        prev.map((file) => {
          // Match by file name since we don't have content-based IDs yet
          const result = processedFiles.find((r) => r.name === file.name);
          if (result) {
            return { ...file, ...result };
          }
          return file;
        })
      );

      // Don't call onProcessFiles here - let the auto-redirect handle it after 5 seconds
    } catch (error) {
      console.error("Error processing files:", error);
      // Mark all files as error
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (newFiles.some((newFile) => newFile.name === file.name)) {
            return {
              ...file,
              status: "error" as const,
              error:
                error instanceof Error ? error.message : "Processing failed",
            };
          }
          return file;
        })
      );
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const allFilesProcessed =
    uploadedFiles.length > 0 &&
    uploadedFiles.every((f) => f.status !== "processing");
  const hasSuccessfulReceipts = uploadedFiles.some(
    (f) => f.status === "receipt" && f.receipt
  );

  // Auto-generate results when all files are processed
  const handleAutoGenerateResults = async () => {
    await onProcessFiles(uploadedFiles);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-16 max-w-4xl flex-grow">
        <div className="text-center mb-8 flex flex-col gap-4">

          <h1 className="text-2xl font-medium bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Organize Your Receipts
          </h1>
          <p className="text-base text-[#4a5565] max-w-full md:max-w-[271px] mx-auto">
            Instantly convert invoices into clear, categorized summaries.
          </p>
        </div>

        <div
          className={`w-full md:w-[650px] mx-auto mb-8 bg-white border border-[#d1d5dc] rounded-2xl shadow-sm ${
            uploadedFiles.length === 0 ? "h-[438px]" : "min-h-[438px]"
          }`}
        >
          <div
            className={`w-fit md:w-[618px] m-4 bg-gray-50 border border-[#d1d5dc] border-dashed rounded-xl flex flex-col ${
              uploadedFiles.length === 0 ? "h-[406px]" : "min-h-[406px]"
            }`}
          >
            {uploadedFiles.length === 0 ? (
              <div
                className="h-full flex flex-col items-center justify-center p-8 cursor-pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="w-[46px] h-[46px] mb-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <img src="/upload.svg" className="size-[24px]" alt="" />
                </div>
                <p className="text-base text-[#101828] mb-2 text-center">
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag and drop your receipts here"}
                </p>
                <p className="text-base text-[#6a7282] mb-6 text-center">
                  or click to select files
                </p>
                <div
                  className="w-[120px] h-10 relative overflow-hidden rounded-md flex items-center justify-center bg-white border border-[#d1d5dc]"
                  style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
                >
                  <p className="text-base text-center text-[#364153]">
                    Select Files
                  </p>
                </div>
              </div>
            ) : uploadedFiles.length > 0 ? (
              <div
                className="flex flex-col justify-start items-start w-full p-[18px] gap-3 cursor-pointer"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`w-full h-[33px] flex items-center justify-between px-3.5 py-2 rounded-md border ${
                      file.status === "error"
                        ? "bg-red-50 border-red-200"
                        : file.status === "receipt"
                        ? "bg-green-50 border-green-200"
                        : file.status === "not-receipt"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-100 border-[#d1d5dc]"
                    }`}
                    style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <p
                        className={`text-xs truncate ${
                          file.status === "error"
                            ? "text-red-700"
                            : "text-[#364153]"
                        }`}
                      >
                        {file.name}
                      </p>
                      {file.status === "processing" && (
                        <img
                          src="/loading.svg"
                          alt="Processing"
                          className="w-4 h-4 animate-spin"
                        />
                      )}
                      {file.status === "receipt" && (
                        <Tooltip content="Receipt data successfully extracted!">
                          <svg
                            className="w-4 h-4 text-green-600 cursor-help"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </Tooltip>
                      )}
                      {file.status === "not-receipt" && (
                        <Tooltip content="No receipt data found in this image. Please try a clearer photo of your receipt.">
                          <svg
                            className="w-4 h-4 text-yellow-600 cursor-help"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </Tooltip>
                      )}
                      {file.status === "error" && (
                        <Tooltip
                          content={`Processing failed: ${
                            file.error || "Unknown error"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 text-red-600 cursor-help"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Tooltip>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="flex-shrink-0 hover:opacity-70 ml-2"
                    >
                      <svg
                        width={12}
                        height={12}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M2.56396 4.0769V7.56408C2.61525 8.23073 2.66653 9.10253 2.71781 9.71793C2.76909 10.4359 3.38448 11 4.10243 11H7.89728C8.61523 11 9.23063 10.4359 9.28193 9.71793C9.33318 9.10253 9.38448 8.23073 9.43578 7.56408C9.48703 6.79483 9.43578 5.20508 9.43578 4.0769H2.56396Z"
                          fill="#8B2323"
                        />
                        <path
                          d="M9.58975 2.53846H8.3077L7.89745 1.76923C7.64105 1.3077 7.1795 1 6.66665 1H5.4359C4.92308 1 4.41026 1.3077 4.20513 1.76923L3.69231 2.53846H2.41025C2.20513 2.53846 2 2.74359 2 2.94872C2 3.15385 2.20513 3.35897 2.41025 3.35897H9.58975C9.79485 3.35897 10 3.20513 10 2.94872C10 2.69231 9.79485 2.53846 9.58975 2.53846ZM4.56411 2.53846L4.82052 2.12821C4.92308 1.92308 5.1282 1.76923 5.3846 1.76923H6.6154C6.8718 1.76923 7.0769 1.8718 7.1795 2.12821L7.4359 2.53846H4.56411Z"
                          fill="#8B2323"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <div
                  className="self-stretch flex-grow-0 flex-shrink-0 h-[33px] relative overflow-hidden rounded-md bg-white border border-[#d1d5dc] cursor-pointer flex flex-row gap-1 items-center px-4 py-2.5"
                  style={{ boxShadow: "0px 1px 12px -7px rgba(0,0,0,0.25)" }}
                >
                  <img src="/upload.svg" className="size-[14px]" alt="" />
                  <p className="text-xs text-left text-[#101828]">
                    Upload more receipts
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <p className="text-base text-[#101828] mb-2 text-center">
                  Processing...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          {uploadedFiles.length > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {allFilesProcessed ? (
                hasSuccessfulReceipts ? (
                  countdown !== null ? (
                    <span className="text-blue-600 animate-pulse">
                      Auto-redirecting to results in {countdown} second
                      {countdown !== 1 ? "s" : ""}...
                    </span>
                  ) : (
                    <span className="text-green-600">
                      All files processed successfully! Redirecting to
                      results...
                    </span>
                  )
                ) : (
                  <span className="text-red-600">
                    Some files failed to process. Please try again.
                  </span>
                )
              ) : (
                <span>
                  Processing files...{" "}
                  {
                    uploadedFiles.filter((f) => f.status !== "processing")
                      .length
                  }
                  /{uploadedFiles.length} complete
                </span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
