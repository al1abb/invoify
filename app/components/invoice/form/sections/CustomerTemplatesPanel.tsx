"use client";

import { useEffect, useMemo, useState } from "react";

// ShadCn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Components
import BaseButton from "@/app/components/reusables/BaseButton";
import Subheading from "@/app/components/reusables/Subheading";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { Check, Pencil, Save, Trash2 } from "lucide-react";

const CustomerTemplatesPanel = () => {
  const {
    customerTemplates,
    saveCustomerTemplate,
    applyCustomerTemplate,
    renameCustomerTemplate,
    deleteCustomerTemplate,
  } = useInvoiceContext();

  const { _t } = useTranslationContext();

  const [templateName, setTemplateName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId) return null;
    return (
      customerTemplates.find((template) => template.id === selectedTemplateId) ||
      null
    );
  }, [customerTemplates, selectedTemplateId]);

  useEffect(() => {
    if (!selectedTemplateId) return;

    const exists = customerTemplates.some(
      (template) => template.id === selectedTemplateId
    );

    if (!exists) {
      setSelectedTemplateId("");
      setTemplateName("");
    }
  }, [customerTemplates, selectedTemplateId]);

  const handleSaveCurrent = () => {
    const name = templateName.trim();
    if (!name) return;

    saveCustomerTemplate(name);
    setTemplateName("");
    setSelectedTemplateId("");
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    applyCustomerTemplate(selectedTemplateId);
  };

  const handleRenameTemplate = () => {
    const name = templateName.trim();
    if (!selectedTemplateId || !name) return;

    const renamed = renameCustomerTemplate(selectedTemplateId, name);
    if (renamed) {
      setTemplateName(name);
    }
  };

  const handleDeleteTemplate = () => {
    if (!selectedTemplateId) return;

    deleteCustomerTemplate(selectedTemplateId);
    setSelectedTemplateId("");
    setTemplateName("");
  };

  return (
    <section className="w-full border rounded-md p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Subheading>{_t("form.steps.fromAndTo.templates.heading")}:</Subheading>
        <small className="text-muted-foreground">
          {customerTemplates.length} {_t("form.steps.fromAndTo.templates.savedCount")}
        </small>
      </div>

      <p className="text-sm text-muted-foreground">
        {_t("form.steps.fromAndTo.templates.description")}
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="template-name-input">
          {_t("form.steps.fromAndTo.templates.nameLabel")}
        </Label>
        <div className="flex flex-wrap gap-2">
          <Input
            id="template-name-input"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            placeholder={_t("form.steps.fromAndTo.templates.namePlaceholder")}
            className="w-full md:w-[18rem]"
            data-testid="customer-template-name-input"
          />
          <BaseButton
            tooltipLabel="Save current sender and receiver as template"
            variant="outline"
            size="sm"
            onClick={handleSaveCurrent}
            disabled={!templateName.trim()}
            data-testid="customer-template-save-btn"
          >
            <Save />
            {_t("form.steps.fromAndTo.templates.saveCurrent")}
          </BaseButton>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{_t("form.steps.fromAndTo.templates.existingLabel")}</Label>
        <Select
          value={selectedTemplateId}
          onValueChange={(templateId) => {
            setSelectedTemplateId(templateId);

            const template = customerTemplates.find(
              (item) => item.id === templateId
            );
            if (template) {
              setTemplateName(template.name);
            }
          }}
        >
          <SelectTrigger
            className="w-full md:w-[22rem]"
            data-testid="customer-template-select-trigger"
          >
            <SelectValue
              placeholder={_t("form.steps.fromAndTo.templates.selectPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {customerTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          <BaseButton
            tooltipLabel="Apply selected template to sender and receiver"
            variant="outline"
            size="sm"
            onClick={handleApplyTemplate}
            disabled={!selectedTemplateId}
            data-testid="customer-template-apply-btn"
          >
            <Check />
            {_t("form.steps.fromAndTo.templates.apply")}
          </BaseButton>
          <BaseButton
            tooltipLabel="Rename selected template"
            variant="outline"
            size="sm"
            onClick={handleRenameTemplate}
            disabled={!selectedTemplateId || !templateName.trim()}
            data-testid="customer-template-rename-btn"
          >
            <Pencil />
            {_t("form.steps.fromAndTo.templates.rename")}
          </BaseButton>
          <BaseButton
            tooltipLabel="Delete selected template"
            variant="destructive"
            size="sm"
            onClick={handleDeleteTemplate}
            disabled={!selectedTemplateId}
            data-testid="customer-template-delete-btn"
          >
            <Trash2 />
            {_t("form.steps.fromAndTo.templates.delete")}
          </BaseButton>
        </div>

        {customerTemplates.length === 0 && (
          <small className="text-muted-foreground">
            {_t("form.steps.fromAndTo.templates.empty")}
          </small>
        )}
        {selectedTemplate && (
          <small className="text-muted-foreground">
            {_t("form.steps.fromAndTo.templates.selected")}: {selectedTemplate.name}
          </small>
        )}
      </div>
    </section>
  );
};

export default CustomerTemplatesPanel;
