"use client"

import { useRef } from 'react';
import { BaseButton } from '@/app/components';
import { useInvoiceContext } from '@/contexts/InvoiceContext';
import { Import } from 'lucide-react';

// Hooks
import useToasts from '@/hooks/useToasts';

type ImportButtonType = {
    setOpen: (open: boolean) => void;
}

const ImportInvoiceButton = ({ setOpen }: ImportButtonType) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { importInvoice, invoicePdfLoading } = useInvoiceContext();
    const { importInvoiceError } = useToasts();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            const ext = fileName.split('.').pop() || '';

            // Check if file extension is supported
            const supportedFormats = ['json', 'csv', 'xml', 'xls', 'xlsx'];
            if (supportedFormats.includes(ext)) {
                await importInvoice(file);
                setOpen(false);
            } else {
                importInvoiceError();
            }
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,.csv,.xml,.xls,.xlsx"
                style={{ display: 'none' }}
            />
            <BaseButton
                variant="outline"
                tooltipLabel="Import invoice (JSON, CSV, XML, XLS, XLSX)"
                disabled={invoicePdfLoading}
                onClick={handleClick}
            >
                <Import />
                Import Invoice
            </BaseButton>
        </>
    );
};

export default ImportInvoiceButton;