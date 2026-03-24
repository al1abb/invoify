"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { InvoiceType } from "@/types";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
    const { settings, updateSettings, resetSettings } = useSettings();
    const { getValues, setValue } = useFormContext<InvoiceType>();
    const t = useTranslations();

    if (!isOpen) return null;

    // Clear discount values from all items when discount per item is disabled
    const handleDiscountToggle = (enabled: boolean) => {
        updateSettings({
            discountPerItem: {
                ...settings.discountPerItem,
                enabled,
            },
        });

        if (!enabled) {
            const formValues = getValues();
            const updatedItems = formValues.details.items.map(item => ({
                ...item,
                discount: undefined,
                discountType: undefined,
            }));
            setValue("details.items", updatedItems);
        }
    };

    // Clear tax values from all items when tax per item is disabled
    const handleTaxToggle = (enabled: boolean) => {
        updateSettings({
            taxPerItem: {
                ...settings.taxPerItem,
                enabled,
            },
        });

        if (!enabled) {
            const formValues = getValues();
            const updatedItems = formValues.details.items.map(item => ({
                ...item,
                tax: undefined,
                taxType: undefined,
            }));
            setValue("details.items", updatedItems);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={onClose}
            />

            {/* Settings Panel */}
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto bg-white dark:bg-slate-950">
                <div className="sticky top-0 border-b bg-white dark:bg-slate-950 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-4">
                    <Tabs defaultValue="fields" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="fields">Fields</TabsTrigger>
                            <TabsTrigger value="items">Items</TabsTrigger>
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                        </TabsList>

                        {/* Fields Tab - Two Column Layout */}
                        <TabsContent value="fields" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* SENDER FIELDS SECTION */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-4">
                                            Sender Fields
                                        </h3>
                                        <div className="space-y-4">
                                            <FieldRequirementItem
                                                label="Address"
                                                value={settings.fieldRequirements.senderAddress}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderAddress: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="ZIP Code"
                                                value={settings.fieldRequirements.senderZipCode}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderZipCode: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="City"
                                                value={settings.fieldRequirements.senderCity}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderCity: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Country"
                                                value={settings.fieldRequirements.senderCountry}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderCountry: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Email"
                                                value={settings.fieldRequirements.senderEmail}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderEmail: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Phone"
                                                value={settings.fieldRequirements.senderPhone}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            senderPhone: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RECEIVER FIELDS SECTION */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-4">
                                            Receiver Fields
                                        </h3>
                                        <div className="space-y-4">
                                            <FieldRequirementItem
                                                label="Address"
                                                value={settings.fieldRequirements.receiverAddress}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverAddress: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="ZIP Code"
                                                value={settings.fieldRequirements.receiverZipCode}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverZipCode: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="City"
                                                value={settings.fieldRequirements.receiverCity}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverCity: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Country"
                                                value={settings.fieldRequirements.receiverCountry}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverCountry: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Email"
                                                value={settings.fieldRequirements.receiverEmail}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverEmail: value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FieldRequirementItem
                                                label="Phone"
                                                value={settings.fieldRequirements.receiverPhone}
                                                onChange={(value) =>
                                                    updateSettings({
                                                        fieldRequirements: {
                                                            ...settings.fieldRequirements,
                                                            receiverPhone: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Display - Full Width */}
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-4">
                                    Currency Display
                                </h3>
                                <FieldRequirementItem
                                    label="Currency Display"
                                    value={settings.currencyDisplay === "symbolAndCode" ? "required" : "optional"}
                                    onChange={(value) =>
                                        updateSettings({
                                            currencyDisplay:
                                                value === "required"
                                                    ? "symbolAndCode"
                                                    : "symbolOnly",
                                        })
                                    }
                                    optionLabels={{ required: "Symbol + Code", optional: "Symbol Only" }}
                                />
                            </div>
                        </TabsContent>

                        {/* Items Tab */}
                        <TabsContent value="items" className="mt-6 space-y-6">
                            <ToggleSettingWithRequired
                                label="SKU / Item Code Column"
                                enabled={settings.skuColumn.enabled}
                                required={settings.skuColumn.required}
                                onEnabledChange={(enabled) =>
                                    updateSettings({
                                        skuColumn: {
                                            ...settings.skuColumn,
                                            enabled,
                                        },
                                    })
                                }
                                onRequiredChange={(required) =>
                                    updateSettings({
                                        skuColumn: {
                                            ...settings.skuColumn,
                                            required,
                                        },
                                    })
                                }
                            />

                            <ToggleSettingWithRequired
                                label="Discount Per Item"
                                enabled={settings.discountPerItem.enabled}
                                required={settings.discountPerItem.required}
                                onEnabledChange={handleDiscountToggle}
                                onRequiredChange={(required) =>
                                    updateSettings({
                                        discountPerItem: {
                                            ...settings.discountPerItem,
                                            required,
                                        },
                                    })
                                }
                            />

                            <ToggleSettingWithRequired
                                label="Tax Per Item"
                                enabled={settings.taxPerItem.enabled}
                                required={settings.taxPerItem.required}
                                onEnabledChange={handleTaxToggle}
                                onRequiredChange={(required) =>
                                    updateSettings({
                                        taxPerItem: {
                                            ...settings.taxPerItem,
                                            required,
                                        },
                                    })
                                }
                            />
                        </TabsContent>

                        {/* Payment Tab */}
                        <TabsContent value="payment" className="mt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="cash-mode">Cash Payment Mode</Label>
                                    <Switch
                                        id="cash-mode"
                                        checked={settings.cashPaymentMode.enabled}
                                        onCheckedChange={(enabled) =>
                                            updateSettings({
                                                cashPaymentMode: { enabled },
                                            })
                                        }
                                    />
                                </div>
                                {settings.cashPaymentMode.enabled && (
                                    <p className="text-xs text-slate-500">
                                        When enabled, bank details become optional and a "Change" field appears
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Reset Button - Always at bottom */}
                    <div className="mt-8 pt-6 border-t">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                resetSettings();
                            }}
                        >
                            Reset to Defaults
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

interface FieldRequirementItemProps {
    label: string;
    value: "required" | "optional";
    onChange: (value: "required" | "optional") => void;
    optionLabels?: { required: string; optional: string };
}

function FieldRequirementItem({
    label,
    value,
    onChange,
    optionLabels,
}: FieldRequirementItemProps) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant={value === "required" ? "default" : "outline"}
                    onClick={() => onChange("required")}
                    className="text-xs min-w-[90px]"
                >
                    {optionLabels?.required || "Required"}
                </Button>
                <Button
                    size="sm"
                    variant={value === "optional" ? "default" : "outline"}
                    onClick={() => onChange("optional")}
                    className="text-xs min-w-[90px]"
                >
                    {optionLabels?.optional || "Optional"}
                </Button>
            </div>
        </div>
    );
}

interface ToggleSettingWithRequiredProps {
    label: string;
    enabled: boolean;
    required: boolean;
    onEnabledChange: (enabled: boolean) => void;
    onRequiredChange: (required: boolean) => void;
}

function ToggleSettingWithRequired({
    label,
    enabled,
    required,
    onEnabledChange,
    onRequiredChange,
}: ToggleSettingWithRequiredProps) {
    return (
        <Card className="p-4">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Switch checked={enabled} onCheckedChange={onEnabledChange} />
                </div>
                {enabled && (
                    <div className="flex items-center justify-between pl-2">
                        <Label className="text-xs text-slate-500">Field Requirement</Label>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={required ? "default" : "outline"}
                                onClick={() => onRequiredChange(true)}
                                className="text-xs"
                            >
                                Required
                            </Button>
                            <Button
                                size="sm"
                                variant={!required ? "default" : "outline"}
                                onClick={() => onRequiredChange(false)}
                                className="text-xs"
                            >
                                Optional
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
