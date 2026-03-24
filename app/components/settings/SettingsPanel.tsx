"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Settings } from "lucide-react";
import { useEffect, useRef } from "react";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const { settings, updateSettings } = useSettings();
    const t = useTranslations("settings");
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Simple focus trap
            panelRef.current?.focus();
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl transition-transform dark:bg-slate-900 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h2 id="settings-title" className="text-xl font-bold uppercase tracking-tight dark:text-white">
                            {t("title")}
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label={t("close")}
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <Tabs defaultValue="fields" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800">
                        <TabsTrigger value="fields" className="text-xs uppercase font-bold tracking-wider">
                            {t("tabs.fields")}
                        </TabsTrigger>
                        <TabsTrigger value="items" className="text-xs uppercase font-bold tracking-wider">
                            {t("tabs.items")}
                        </TabsTrigger>
                        <TabsTrigger value="payment" className="text-xs uppercase font-bold tracking-wider">
                            {t("tabs.payment")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fields" className="space-y-4">
                        <SectionHeader 
                            title={t("fieldRequirements.title")} 
                            description={t("fieldRequirements.description")} 
                        />
                        <div className="space-y-3">
                            {/* Sender Fields */}
                            <FieldRequirementItem
                                label={t("fields.senderAddress")}
                                currentStatus={settings.fieldRequirements.senderAddress}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderAddress: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.senderZipCode")}
                                currentStatus={settings.fieldRequirements.senderZipCode}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderZipCode: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.senderCity")}
                                currentStatus={settings.fieldRequirements.senderCity}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderCity: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.senderCountry")}
                                currentStatus={settings.fieldRequirements.senderCountry}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderCountry: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.senderEmail")}
                                currentStatus={settings.fieldRequirements.senderEmail}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderEmail: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.senderPhone")}
                                currentStatus={settings.fieldRequirements.senderPhone}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, senderPhone: status } })}
                            />
                            <div className="h-4 border-b border-slate-100 dark:border-slate-800 my-2" />
                            {/* Receiver Fields */}
                            <FieldRequirementItem
                                label={t("fields.receiverAddress")}
                                currentStatus={settings.fieldRequirements.receiverAddress}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverAddress: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.receiverZipCode")}
                                currentStatus={settings.fieldRequirements.receiverZipCode}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverZipCode: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.receiverCity")}
                                currentStatus={settings.fieldRequirements.receiverCity}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverCity: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.receiverCountry")}
                                currentStatus={settings.fieldRequirements.receiverCountry}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverCountry: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.receiverEmail")}
                                currentStatus={settings.fieldRequirements.receiverEmail}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverEmail: status } })}
                            />
                            <FieldRequirementItem
                                label={t("fields.receiverPhone")}
                                currentStatus={settings.fieldRequirements.receiverPhone}
                                updateStatus={(status) => updateSettings({ fieldRequirements: { ...settings.fieldRequirements, receiverPhone: status } })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="items" className="space-y-4">
                        <SectionHeader 
                            title={t("itemFeatures.title")} 
                            description={t("itemFeatures.description")} 
                        />
                        <div className="space-y-3">
                            <ToggleItem
                                label={t("items.skuColumn")}
                                isEnabled={settings.skuColumn.enabled}
                                onToggle={(enabled) => updateSettings({ skuColumn: { ...settings.skuColumn, enabled } })}
                                isRequired={settings.skuColumn.required}
                                onToggleRequired={(required) => updateSettings({ skuColumn: { ...settings.skuColumn, required } })}
                            />
                            <ToggleItem
                                label={t("items.discountPerItem")}
                                isEnabled={settings.discountPerItem.enabled}
                                onToggle={(enabled) => updateSettings({ discountPerItem: { ...settings.discountPerItem, enabled } })}
                                isRequired={settings.discountPerItem.required}
                                onToggleRequired={(required) => updateSettings({ discountPerItem: { ...settings.discountPerItem, required } })}
                            />
                            <ToggleItem
                                label={t("items.taxPerItem")}
                                isEnabled={settings.taxPerItem.enabled}
                                onToggle={(enabled) => updateSettings({ taxPerItem: { ...settings.taxPerItem, enabled } })}
                                isRequired={settings.taxPerItem.required}
                                onToggleRequired={(required) => updateSettings({ taxPerItem: { ...settings.taxPerItem, required } })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="payment" className="space-y-4">
                        <SectionHeader 
                            title={t("paymentModes.title")} 
                            description={t("paymentModes.description")} 
                        />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-md">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("payment.cashPaymentMode")}
                                </span>
                                <Switch
                                    checked={settings.cashPaymentMode.enabled}
                                    onCheckedChange={(enabled) => updateSettings({ cashPaymentMode: { enabled } })}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-2">
                {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                {description}
            </p>
        </div>
    );
}

function FieldRequirementItem({ 
    label, 
    currentStatus, 
    updateStatus 
}: { 
    label: string; 
    currentStatus: "required" | "optional" | "hidden";
    updateStatus: (status: "required" | "optional" | "hidden") => void;
}) {
    const t = useTranslations("settings.status");
    return (
        <Card className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
            <div className="flex gap-2">
                {(["required", "optional", "hidden"] as const).map((status) => (
                    <Button
                        key={status}
                        size="sm"
                        variant={currentStatus === status ? "default" : "outline"}
                        onClick={() => updateStatus(status)}
                        className="flex-1 text-[10px] uppercase font-bold tracking-widest h-8"
                    >
                        {t(status)}
                    </Button>
                ))}
            </div>
        </Card>
    );
}

function ToggleItem({ 
    label, 
    isEnabled, 
    onToggle, 
    isRequired, 
    onToggleRequired 
}: { 
    label: string; 
    isEnabled: boolean; 
    onToggle: (enabled: boolean) => void;
    isRequired: boolean;
    onToggleRequired: (required: boolean) => void;
}) {
    const t = useTranslations("settings.status");
    return (
        <Card className="p-4 flex flex-col gap-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={onToggle}
                />
            </div>
            {isEnabled && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Requirement</span>
                        <div className="flex gap-2 w-48">
                            <Button
                                size="sm"
                                variant={isRequired ? "default" : "outline"}
                                onClick={() => onToggleRequired(true)}
                                className="flex-1 text-[10px] uppercase font-bold tracking-widest h-7"
                            >
                                {t("required")}
                            </Button>
                            <Button
                                size="sm"
                                variant={!isRequired ? "default" : "outline"}
                                onClick={() => onToggleRequired(false)}
                                className="flex-1 text-[10px] uppercase font-bold tracking-widest h-7"
                            >
                                {t("optional")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
