"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const SyncConflictsModal = () => {
  const {
    syncConflicts,
    resolveSyncConflict,
    resolveSyncConflictsWithDefaults,
  } = useInvoiceContext();
  const { _t } = useTranslationContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (syncConflicts.length === 0) {
      setOpen(false);
    }
  }, [syncConflicts.length]);

  if (syncConflicts.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" data-testid="sync-conflicts-btn">
          {_t("sync.conflicts.open")} ({syncConflicts.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{_t("sync.conflicts.title")}</DialogTitle>
          <DialogDescription>
            {_t("sync.conflicts.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resolveSyncConflictsWithDefaults();
            }}
            data-testid="sync-conflicts-apply-defaults"
          >
            {_t("sync.conflicts.applyDefaults")}
          </Button>
        </div>

        <ScrollArea className="h-[360px] rounded-md border p-2">
          <div className="space-y-3">
            {syncConflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="rounded-md border px-3 py-3"
                data-testid={`sync-conflict-${conflict.id}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">
                    {_t(`sync.conflicts.entity.${conflict.entityType}`)}: {" "}
                    {conflict.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {_t("sync.conflicts.defaultChoice")}: {" "}
                    {_t(`sync.conflicts.choice.${conflict.defaultChoice}`)}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <span>
                    {_t("sync.conflicts.localUpdated")}: {" "}
                    {formatDateTime(conflict.localUpdatedAt)}
                  </span>
                  <span>
                    {_t("sync.conflicts.cloudUpdated")}: {" "}
                    {formatDateTime(conflict.cloudUpdatedAt)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resolveSyncConflict(conflict.id, "local");
                    }}
                    data-testid={`sync-conflict-use-local-${conflict.id}`}
                  >
                    {_t("sync.conflicts.useLocal")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resolveSyncConflict(conflict.id, "cloud");
                    }}
                    data-testid={`sync-conflict-use-cloud-${conflict.id}`}
                  >
                    {_t("sync.conflicts.useCloud")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SyncConflictsModal;
