"use client";

import React, { useCallback } from "react";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

//DnD kit
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import { BaseButton, SingleItem } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/app/contexts/TranslationContext";

// Icons
import { Plus } from "lucide-react";

// Types
import { InvoiceType } from "@/app/types/types";

type ItemsProps = {};

const Items = ({}: ItemsProps) => {
    const { control, setValue } = useFormContext<InvoiceType>();

    const { _t } = useTranslationContext();

    const ITEMS_NAME = "details.items";

    const { fields, append, remove, swap, move } = useFieldArray({
        control: control,
        name: ITEMS_NAME,
    });

    const addNewField = () => {
        append({
            name: "",
            description: "",
            quantity: 0,
            unitPrice: 0,
            total: 0,
        });
    };

    const removeField = (index: number) => {
        remove(index);
    };

    const moveFieldUp = (index: number) => {
        if (index > 0) {
            move(index, index - 1);
        }
    };
    const moveFieldDown = (index: number) => {
        if (index < fields.length - 1) {
            move(index, index + 1);
        }
    };

    // DnD
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = useCallback(
        async (event: DragEndEvent) => {
            const { active, over } = event;
            let updatedItems = fields;
            if (active.id !== over?.id) {
                const oldIndex = fields.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = fields.findIndex(
                    (item) => item.id === over?.id
                );

                // Rearrange the items
                // updatedItems = arrayMove(fields, oldIndex, newIndex);
                // setValue(ITEMS_NAME, fields);
                swap(oldIndex, newIndex);
            }
        },
        [fields, setValue]
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-xl font-semibold">
                {_t("form.steps.lineItems.heading")}:
            </Label>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={fields}
                    strategy={verticalListSortingStrategy}
                >
                    {fields.map((field, index) => (
                        <SingleItem
                            key={field.id}
                            name={ITEMS_NAME}
                            index={index}
                            fields={fields}
                            field={field}
                            moveFieldUp={moveFieldUp}
                            moveFieldDown={moveFieldDown}
                            removeField={removeField}
                        />
                    ))}
                </SortableContext>
                {/* <DragOverlay>
                    <p>Moving Item</p>
                </DragOverlay> */}
            </DndContext>
            <BaseButton
                tooltipLabel="Add a new item to the list"
                className="w-fit"
                onClick={addNewField}
            >
                <Plus />
                {_t("form.steps.lineItems.addNewItem")}
            </BaseButton>
        </div>
    );
};

export default Items;
