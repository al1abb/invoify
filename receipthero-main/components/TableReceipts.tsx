"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import type { ProcessedReceipt } from "../lib/types";
import { formatDisplayDate, toTitleCase } from "../lib/utils";
import ReceiptDetailsDialog from "./ReceiptDetailsDialog";

interface TableReceiptsProps {
  processedReceipts: ProcessedReceipt[];
  onDeleteReceipt: (receiptId: string) => void;
  onStartOver: () => void;
}

function calculateTotals(receipts: ProcessedReceipt[]) {
  const totalSpending = receipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );
  return totalSpending;
}

export default function TableReceipts({
  processedReceipts,
  onDeleteReceipt,
  onStartOver,
}: TableReceiptsProps) {
  const [selectedReceipt, setSelectedReceipt] =
    useState<ProcessedReceipt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first

  const totalSpending = calculateTotals(processedReceipts);

  // Sort receipts by date
  const sortedReceipts = [...processedReceipts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleDateSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleRowClick = (receipt: ProcessedReceipt) => {
    setSelectedReceipt(receipt);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedReceipt(null);
  };

  return (
    <main className="flex-1 p-4">
      <div className="mb-5 mt-1 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-left text-[#030712]">
          Your Overview:
        </h1>
        <div className="flex flex-row justify-start items-center gap-3">
          <button
            className="flex justify-end items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 px-[18px] py-[9px] rounded-md bg-white border border-[#d1d5dc] cursor-pointer"
            style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
            onClick={onStartOver}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M9.99237 1.69336C7.97749 1.69336 6.08315 2.47799 4.65841 3.90277C3.23367 5.32754 2.44897 7.22184 2.44897 9.23675C2.44897 11.2656 3.24292 13.1691 4.68455 14.5968C4.97196 14.8814 5.43573 14.8792 5.72033 14.5917C6.00496 14.3043 6.00272 13.8406 5.71528 13.556C4.5536 12.4055 3.91382 10.8716 3.91382 9.23675C3.91382 5.88503 6.64064 3.1582 9.99233 3.1582C13.344 3.1582 16.0709 5.88503 16.0709 9.23675C16.0709 12.0983 14.0832 14.5039 11.4161 15.1465L11.5443 15.0183C11.8303 14.7323 11.8303 14.2686 11.5443 13.9825C11.2582 13.6965 10.7945 13.6965 10.5084 13.9825L8.96112 15.5299C8.67511 15.8159 8.67511 16.2796 8.96112 16.5657L10.5084 18.113C10.6515 18.256 10.8389 18.3275 11.0264 18.3275C11.2138 18.3275 11.4013 18.256 11.5443 18.113C11.8303 17.827 11.8303 17.3632 11.5443 17.0772L11.1579 16.6908C12.7301 16.4484 14.1802 15.7169 15.3263 14.5708C16.7511 13.146 17.5357 11.2517 17.5357 9.23678C17.5357 7.22187 16.7511 5.32757 15.3263 3.9028C13.9015 2.47803 12.0073 1.69336 9.99237 1.69336Z"
                fill="#1E2939"
              />
            </svg>
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-right text-[#101828]">
              Start Over
            </p>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#d1d5dc] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 font-medium text-sm text-left text-[#99a1af]">
                  Receipt
                </th>
                <th
                  className="p-4 font-medium text-sm text-left text-[#99a1af] cursor-pointer hover:text-[#6a7282] select-none"
                  onClick={handleDateSort}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  </div>
                </th>
                {[
                  "Vendor",
                  "Category",
                  "Payment Method",
                  "Tax Amount",
                  "Amount",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-4 font-medium text-sm text-left text-[#99a1af]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedReceipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="border-b hover:bg-muted/25 text-base text-left text-[#1e2939] cursor-pointer"
                  onClick={() => handleRowClick(receipt)}
                >
                  <td className="p-4">
                    <img
                      src={receipt.thumbnail || "/placeholder.svg"}
                      alt="Receipt thumbnail"
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </td>
                  <td className="p-4">{formatDisplayDate(receipt.date)}</td>
                  <td className="p-4">{receipt.vendor}</td>
                  <td className="p-4">{toTitleCase(receipt.category)}</td>
                  <td className="p-4">{toTitleCase(receipt.paymentMethod)}</td>
                  <td className="p-4">${receipt.taxAmount.toFixed(2)}</td>
                  <td className="p-4 font-semibold">
                    ${receipt.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteReceipt(receipt.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-primary text-primary-foreground">
              <tr>
                <td colSpan={7} className="p-4 font-semibold">
                  Total:
                </td>
                <td className="p-4 font-bold">${totalSpending.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <ReceiptDetailsDialog
        receipt={selectedReceipt}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onDelete={onDeleteReceipt}
      />
    </main>
  );
}
