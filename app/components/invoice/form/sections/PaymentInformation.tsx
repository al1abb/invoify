"use client";

import { useFormContext, useWatch, Controller } from "react-hook-form";

// Components
import { FormInput, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useSettings } from "@/contexts/SettingsContext";

// UI Components
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PaymentInformation = () => {
    const { _t } = useTranslationContext();
    const { settings } = useSettings();
    const { control } = useFormContext();

    const isCash = useWatch({
        name: "details.paymentInformation.isCash",
        control,
        defaultValue: false,
    });

    return (
        <section>
            <Subheading>{_t("form.steps.paymentInfo.heading")}:</Subheading>

            {/* Cash Payment Mode - Conditional */}
            {settings.cashPaymentMode.enabled && (
                <Controller
                    control={control}
                    name="details.paymentInformation.isCash"
                    render={({ field }) => (
                        <div className="flex items-center gap-3 mt-5 mb-5">
                            <Switch
                                id="cash-mode"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="cash-mode" className="cursor-pointer">
                                Cash Payment
                            </Label>
                        </div>
                    )}
                />
            )}

            {/* Bank Details - Hidden when cash mode is enabled and is cash payment */}
            {!(isCash && settings.cashPaymentMode.enabled) && (
                <div className="flex flex-wrap gap-10 mt-5">
                    <FormInput
                        name="details.paymentInformation.bankName"
                        label={_t("form.steps.paymentInfo.bankName")}
                        placeholder={_t("form.steps.paymentInfo.bankName")}
                        vertical
                    />
                    <FormInput
                        name="details.paymentInformation.accountName"
                        label={_t("form.steps.paymentInfo.accountName")}
                        placeholder={_t("form.steps.paymentInfo.accountName")}
                        vertical
                    />
                    <FormInput
                        name="details.paymentInformation.accountNumber"
                        label={_t("form.steps.paymentInfo.accountNumber")}
                        placeholder={_t("form.steps.paymentInfo.accountNumber")}
                        vertical
                    />
                </div>
            )}

            {/* Change Field - Shown only when cash mode is enabled */}
            {isCash && settings.cashPaymentMode.enabled && (
                <div className="mt-5">
                    <FormInput
                        name="details.paymentInformation.change"
                        type="number"
                        label="Change"
                        placeholder="0"
                        vertical
                    />
                </div>
            )}
        </section>
    );
};

export default PaymentInformation;
