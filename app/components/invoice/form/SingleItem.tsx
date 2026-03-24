"use client";

import { useEffect } from "react";

// RHF
import { FieldArrayWithId, useFormContext, useWatch } from "react-hook-form";

// DnD
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ShadCn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, FormInput, FormSelect, FormTextarea } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useSettings } from "@/contexts/SettingsContext";

// Icons
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

// Types
import { ItemType, NameType } from "@/types";

type SingleItemProps = {
    name: NameType;
    index: number;
    fields: ItemType[];
    field: FieldArrayWithId<ItemType>;
    moveFieldUp: (index: number) => void;
    moveFieldDown: (index: number) => void;
    removeField: (index: number) => void;
};

const SingleItem = ({
    name,
    index,
    fields,
    field,
    moveFieldUp,
    moveFieldDown,
    removeField,
}: SingleItemProps) => {
    const { control, setValue } = useFormContext();
    const { settings } = useSettings();

    const { _t } = useTranslationContext();

    // Items
    const itemName = useWatch({
        name: `${name}[${index}].name`,
        control,
    });

    const rate = useWatch({
        name: `${name}[${index}].unitPrice`,
        control,
    });

    const quantity = useWatch({
        name: `${name}[${index}].quantity`,
        control,
    });

    const discount = useWatch({
        name: `${name}[${index}].discount`,
        control,
    });

    const discountType = useWatch({
        name: `${name}[${index}].discountType`,
        control,
    });

    const tax = useWatch({
        name: `${name}[${index}].tax`,
        control,
    });

    const taxType = useWatch({
        name: `${name}[${index}].taxType`,
        control,
    });

    const total = useWatch({
        name: `${name}[${index}].total`,
        control,
    });

    // Currency
    const currency = useWatch({
        name: `details.currency`,
        control,
    });

    useEffect(() => {
        // Calculate total when rate, quantity, discount or tax changes
        if (rate != undefined && quantity != undefined) {
            const baseAmount = rate * quantity;
            let discountValue = 0;
            let taxValue = 0;

            if (discount != undefined && !isNaN(discount)) {
                if (discountType === "percentage") {
                    discountValue = baseAmount * (discount / 100);
                } else {
                    discountValue = discount;
                }
            }

            if (tax != undefined && !isNaN(tax)) {
                if (taxType === "percentage") {
                    taxValue = baseAmount * (tax / 100);
                } else {
                    taxValue = tax;
                }
            }

            const calculatedTotal = (baseAmount - discountValue - taxValue).toFixed(2);
            setValue(`${name}[${index}].total`, calculatedTotal);
        }
    }, [rate, quantity, discount, discountType, tax, taxType]);

    // DnD
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const boxDragClasses = isDragging
        ? "border-2 bg-gray-200 border-blue-600 dark:bg-slate-900 z-10"
        : "border";

    const gripDragClasses = isDragging
        ? "opacity-0 group-hover:opacity-100 transition-opacity cursor-grabbing"
        : "cursor-grab";

    return (
        <div
            style={style}
            {...attributes}
            className={`group flex flex-col gap-4 p-4 my-2 rounded-lg transition-all duration-200 ${
                isDragging
                    ? "bg-blue-50 border-2 border-blue-400 shadow-lg dark:bg-blue-900/20 dark:border-blue-500"
                    : "border border-gray-200 bg-white dark:bg-slate-800 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
            }`}
        >
            {/* Header with Title & Controls */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <div
                        className={`flex-shrink-0 p-1 rounded transition-all ${gripDragClasses}`}
                        ref={setNodeRef}
                        {...listeners}
                        aria-label="Drag to reorder item"
                    >
                        <GripVertical size={18} className="text-gray-400 group-hover:text-blue-500 dark:text-gray-500" />
                    </div>

                    {/* Item Title */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Item #{index + 1}
                        </p>
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                            {itemName || "Untitled item"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 flex-shrink-0">
                    <BaseButton
                        size="icon"
                        variant="ghost"
                        tooltipLabel="Move up"
                        onClick={() => moveFieldUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8"
                    >
                        <ChevronUp size={16} />
                    </BaseButton>

                    <BaseButton
                        size="icon"
                        variant="ghost"
                        tooltipLabel="Move down"
                        onClick={() => moveFieldDown(index)}
                        disabled={index === fields.length - 1}
                        className="h-8 w-8"
                    >
                        <ChevronDown size={16} />
                    </BaseButton>
                </div>
            </div>

            {/* Main Fields Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                key={index}
            >
                <div className="sm:col-span-2">
                    <FormInput
                        name={`${name}[${index}].name`}
                        label={_t("form.steps.lineItems.name")}
                        placeholder="Item name"
                        vertical
                    />
                </div>

                <FormInput
                    name={`${name}[${index}].quantity`}
                    type="number"
                    label={_t("form.steps.lineItems.quantity")}
                    placeholder="0"
                    vertical
                />

                <FormInput
                    name={`${name}[${index}].unitPrice`}
                    type="number"
                    label={_t("form.steps.lineItems.rate")}
                    labelHelper={`(${currency})`}
                    placeholder="0"
                    vertical
                />

                <div className="flex flex-col gap-2 pt-1">
                    <Label className="text-sm font-medium">{_t("form.steps.lineItems.total")}</Label>
                    <div className="px-3 py-2 rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-gray-600">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {total} <span className="text-sm text-gray-600 dark:text-gray-400">{currency}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <FormTextarea
                name={`${name}[${index}].description`}
                label={_t("form.steps.lineItems.description")}
                placeholder="Item description"
            />

            {/* Optional Fields Section */}
            {(settings.skuColumn.enabled || settings.discountPerItem.enabled || settings.taxPerItem.enabled) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
                    {/* SKU Column - Conditional */}
                    {settings.skuColumn.enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <FormInput
                                name={`${name}[${index}].sku`}
                                label="SKU / Item Code"
                                placeholder="SKU or item code"
                                vertical
                                defaultValue=""
                            />
                        </div>
                    )}

                    {/* Discount Per Item - Conditional */}
                    {settings.discountPerItem.enabled && (
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                name={`${name}[${index}].discount`}
                                type="number"
                                label="Discount"
                                placeholder="0"
                                vertical
                                defaultValue={0}
                                disabled={!rate}
                            />
                            <FormSelect
                                name={`${name}[${index}].discountType`}
                                label="Type"
                                placeholder="Type"
                                options={[
                                    { label: "Amount", value: "amount" },
                                    { label: "Percentage", value: "percentage" },
                                ]}
                                vertical
                                defaultValue="amount"
                            />
                        </div>
                    )}

                    {/* Tax Per Item - Conditional */}
                    {settings.taxPerItem.enabled && (
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                name={`${name}[${index}].tax`}
                                type="number"
                                label="Tax"
                                placeholder="0"
                                vertical
                                defaultValue={0}
                                disabled={!rate}
                            />
                            <FormSelect
                                name={`${name}[${index}].taxType`}
                                label="Type"
                                placeholder="Type"
                                options={[
                                    { label: "Amount", value: "amount" },
                                    { label: "Percentage", value: "percentage" },
                                ]}
                                vertical
                                defaultValue="amount"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Delete Button */}
            {fields.length > 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <BaseButton
                        variant="destructive"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="w-full"
                    >
                        <Trash2 size={16} />
                        {_t("form.steps.lineItems.removeItem")}
                    </BaseButton>
                </div>
            )}
        </div>
    );
};

export default SingleItem;
