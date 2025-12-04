"use client";

import { GITHUB_LINK } from "../lib/constant";
import type { ProcessedReceipt, SpendingBreakdown } from "../lib/types";

interface SidebarReceiptsProps {
  processedReceipts: ProcessedReceipt[];
  spendingBreakdown: SpendingBreakdown;
  onAddMoreReceipts: () => void;
  isProcessing: boolean;
}

function calculateTotals(receipts: ProcessedReceipt[]) {
  const totalSpending = receipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );
  const totalReceipts = receipts.length;
  return { totalSpending, totalReceipts };
}

export default function SidebarReceipts({
  processedReceipts,
  spendingBreakdown,
  onAddMoreReceipts,
  isProcessing,
}: SidebarReceiptsProps) {
  const { totalSpending, totalReceipts } = calculateTotals(processedReceipts);

  return (
    <div className="w-[calc(100% - 16px)] md:max-w-[322px] rounded-2xl bg-white border border-[#d1d5dc] m-4 md:mr-0 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" className="w-6 h-6" alt="Icon" />
          <img
            src="/logo.svg"
            className="text-lg font-semibold text-[#101828]"
            width="107"
            height="20"
            alt="Receipt Hero"
          />
        </div>
        <a
          href={GITHUB_LINK}
          target="_blank"
          className="flex items-center gap-1.5 px-3.5 py-[7px] rounded bg-white/80 border border-[#d1d5dc]"
          style={{ boxShadow: "0px 1px 7px -5px rgba(0,0,0,0.25)" }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            preserveAspectRatio="xMidYMid meet"
          >
            <g clipPath="url(#clip0_125_665)">
              <path
                d="M7 0.35022C7.24335 0.35022 7.46546 0.477176 7.59082 0.680298L7.63867 0.772095L9.23633 4.51135L9.24805 4.5387L9.27734 4.54163L13.3184 4.90881C13.5957 4.93381 13.8304 5.1211 13.916 5.38538C14.002 5.65035 13.9215 5.94028 13.7119 6.12366L10.6582 8.80139L10.6357 8.8219L10.6426 8.85022L11.543 12.818C11.6044 13.0896 11.4983 13.3711 11.2725 13.5348C11.0472 13.6979 10.7474 13.7109 10.5098 13.568L7.02539 11.485L7 11.4694L6.97461 11.485L3.48926 13.568C3.37918 13.6339 3.25609 13.6666 3.13281 13.6666C3.02566 13.6666 2.91908 13.6419 2.82129 13.5924L2.72656 13.5348C2.50085 13.3716 2.39553 13.0903 2.45703 12.818L3.35742 8.85022L3.36426 8.8219L3.3418 8.80139L0.287109 6.12366V6.12268C0.077799 5.9399 -0.00200471 5.64982 0.0839844 5.38538C0.170086 5.12104 0.404724 4.93441 0.681641 4.90881L0.680664 4.90784L4.72266 4.54163L4.75195 4.5387L4.76367 4.51135L6.36133 0.772095C6.47129 0.515683 6.722 0.350248 7 0.35022Z"
                fill="#D5A512"
                stroke="#364153"
                strokeWidth="0.1"
              />
            </g>
            <defs>
              <clipPath id="clip0_125_665">
                <rect width={14} height={14} fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="text-sm text-[#1e2939]">GitHub</p>
        </a>
      </div>
      {/* Total Spending */}
      <div className="">
        <div className="px-8 py-6">
          <p className="text-sm text-[#1d293d] mb-2">Total Spending</p>
          <p className="text-4xl font-semibold text-[#020618] mb-4">
            ${totalSpending.toFixed(2)}
          </p>
          <p className="text-sm text-[#4a5565]">
            {totalReceipts} receipts processed
          </p>
        </div>
        {/* Spending Breakdown */}
        <div className="bg-white border border-gray-200 px-8 py-5 mb-6">
          <div className="space-y-4">
            {spendingBreakdown.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium capitalize">
                    {category.name}
                  </span>
                  <span className="text-sm">${category.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="w-full bg-gray-100 rounded-full h-2 mr-2">
                    <div
                      className="bg-[#1e2939] h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#6a7282]">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Upload Section */}
        <div
          className="rounded-xl bg-gray-50 border border-[#d1d5dc] border-dashed p-4 cursor-pointer m-6"
          onClick={onAddMoreReceipts}
          style={isProcessing ? { opacity: 0.5, pointerEvents: "none" } : {}}
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src={isProcessing ? "/loading.svg" : "/upload.svg"}
              className={`w-8 h-8 ${isProcessing ? "animate-spin" : ""}`}
              alt={isProcessing ? "Loading" : "Upload"}
            />
            <p className="text-base font-medium text-[#1e2939]">
              {isProcessing ? "Uploading receipts..." : "Upload Receipts"}
            </p>
            <p className="text-sm text-center text-[#6a7282]">
              Receipts will be added to the table
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
