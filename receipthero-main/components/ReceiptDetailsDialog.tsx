"use client";

import { Dialog, DialogContent, DialogClose, DialogTitle } from "./ui/dialog";
import { Button } from "../ui/button";
import { Trash2, X } from "lucide-react";
import type { ProcessedReceipt } from "../lib/types";
import { formatDisplayDate, toTitleCase } from "../lib/utils";

interface ReceiptDetailsDialogProps {
  receipt: ProcessedReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (receiptId: string) => void;
}

export default function ReceiptDetailsDialog({
  receipt,
  isOpen,
  onClose,
  onDelete,
}: ReceiptDetailsDialogProps) {
  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[756px] !max-w-[756px] p-0 border-gray-200">
        <DialogTitle className="sr-only">
          Receipt Details - {receipt.vendor}
        </DialogTitle>
        <div className="flex flex-row gap-5 p-5 bg-white rounded-2xl min-h-[443px]">
          {/* Receipt Image */}
          <div className="flex-shrink-0 w-[335px] h-[403px] overflow-hidden rounded-xl bg-gray-200">
            <img
              src={receipt.thumbnail || "/placeholder.svg"}
              alt="Receipt"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Receipt Details */}
          <div className="flex flex-col flex-1 gap-4">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-medium text-[#101828]">
                {receipt.vendor}
              </h2>
              <p className="text-sm text-[#6a7282]">
                {formatDisplayDate(receipt.date)}
              </p>
            </div>

            {/* Details List */}
            <div className="flex flex-col gap-0">
               {/* Amount */}
                <div className="flex flex-col gap-2 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6a7282]">Amount</span>
                    <span className="text-base font-medium text-[#1e2939]">
                      ${receipt.amount.toFixed(2)} USD
                    </span>
                  </div>
                  {receipt.originalAmount && receipt.currency && receipt.currency !== 'USD' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6a7282]">Original Amount</span>
                        <span className="text-sm text-[#6a7282]">
                          {receipt.originalAmount.toFixed(2)} {receipt.currency}
                        </span>
                      </div>
                      {receipt.exchangeRate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#6a7282]">Exchange Rate</span>
                          <span className="text-sm text-[#6a7282]">
                            1 {receipt.currency} = {(1 / receipt.exchangeRate).toFixed(4)} USD
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

              {/* Category */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-[#6a7282]">Category</span>
                <span className="text-base font-medium text-[#1e2939]">
                  {toTitleCase(receipt.category)}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-[#6a7282]">Payment Method</span>
                <span className="text-base font-medium text-[#1e2939]">
                  {toTitleCase(receipt.paymentMethod)}
                </span>
              </div>

               {/* Tax Amount */}
               <div className="flex flex-col gap-2 py-3 border-b border-gray-200">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-[#6a7282]">Tax Amount</span>
                   <span className="text-base font-medium text-[#1e2939]">
                     ${receipt.taxAmount.toFixed(2)} USD
                   </span>
                 </div>
                 {receipt.originalTaxAmount && receipt.currency && receipt.currency !== 'USD' && (
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-[#6a7282]">Original Tax</span>
                     <span className="text-sm text-[#6a7282]">
                       {receipt.originalTaxAmount.toFixed(2)} {receipt.currency}
                     </span>
                   </div>
                 )}
               </div>
            </div>

            {/* Footer with Delete Button */}
            <div className="flex justify-end items-center mt-auto">
              <Button
                onClick={() => {
                  onDelete(receipt.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-[18px] py-2 rounded-md bg-[#8b2323] hover:bg-[#7a1f1f] text-white"
                style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">Delete</span>
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <DialogClose className="absolute top-4 right-4 w-4 h-4 text-[#6a7282] hover:text-gray-800">
            <X className="w-4 h-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
