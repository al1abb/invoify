"use client";

import React, { useCallback, useMemo, useState } from "react";
import { BaseButton, Subheading } from "@/app/components";
import { Eye, DownloadCloudIcon, Printer, MoveLeft } from "lucide-react";
import ProductCatalogTemplate, { PRODUCT_CATALOG_DATA } from "@/app/components/templates/catalog-pdf/ProductCatalogTemplate";
export default function CatalogPage() {
    const [loadingAction, setLoadingAction] = useState<"preview" | "download" | "print" | null>(null);
    const apiEndpoint = useMemo(() => "/api/catalog/generate", []);

    const generateAndPreview = useCallback(async () => {
        console.log("generateAndPreview");
        try {
            setLoadingAction("preview");
            const res = await fetch(apiEndpoint, { method: "POST" });
            console.log(res);
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
        }catch(error){
            console.error(error);
        }finally {
            setLoadingAction(null);
        }
    }, [apiEndpoint]);

    const generateAndDownload = useCallback(async () => {
        try {
            setLoadingAction("download");
            const res = await fetch(apiEndpoint, { method: "POST" });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "product-catalog.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoadingAction(null);
        }
    }, [apiEndpoint]);

    const generateAndPrint = useCallback(async () => {
        try {
            setLoadingAction("print");
            const res = await fetch(apiEndpoint, { method: "POST" });
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const win = window.open(url, "_blank");
            if (win) {
                win.addEventListener("load", () => win.print());
            }
        } finally {
            setLoadingAction(null);
        }
    }, [apiEndpoint]);

    return (
        <div className="mx-auto">
            <Subheading>Product Catalog PDF:</Subheading>
            <div className="flex items-center mb-3">
                <BaseButton variant={"ghost"} size="sm" onClick={() => history.back()}>
                    <MoveLeft className="w-5 h-5" />
                    Back
                </BaseButton>
            </div>

            <div className="flex flex-wrap gap-2 my-1">
                <BaseButton tooltipLabel="Preview catalog in new tab" onClick={()=>{console.log("preview"); generateAndPreview()}} size="sm" variant={"outline"} loading={loadingAction === "preview"} loadingText="Generating...">
                    <Eye className="w-5 h-5" />
                    Preview
                </BaseButton>
                <BaseButton tooltipLabel="Download catalog PDF" onClick={generateAndDownload} size="sm" variant={"outline"} loading={loadingAction === "download"} loadingText="Downloading...">
                    <DownloadCloudIcon className="w-5 h-5" />
                    Download
                </BaseButton>
                <BaseButton tooltipLabel="Print catalog" onClick={generateAndPrint} size="sm" variant={"outline"} loading={loadingAction === "print"} loadingText="Preparing...">
                    <Printer className="w-5 h-5" />
                    Print
                </BaseButton>
            </div>

            {loadingAction && (
                <div className="mt-2 text-sm text-gray-600">Processing {loadingAction}...</div>
            )}

            {/* On-screen visual template preview before generating PDF */}
            <div className="mt-3 max-w-3xl bg-white rounded-xl p-3 border border-gray-200">
                {ProductCatalogTemplate(PRODUCT_CATALOG_DATA)}
            </div>
        </div>
    );
}


