"use client";

import React, { useState } from "react";

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
import {
  clearClientTelemetryEvents,
  listClientTelemetryEvents,
  type ClientTelemetryEvent,
} from "@/lib/telemetry/clientTelemetry";
import { useTranslationContext } from "@/contexts/TranslationContext";

const isSyncEvent = (name: ClientTelemetryEvent["name"]) => {
  return name.startsWith("sync_");
};

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const toPrettyJson = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const SyncDiagnosticsModal = () => {
  const { _t } = useTranslationContext();
  const [open, setOpen] = useState(false);
  const [, setRefreshTick] = useState(0);

  const events = listClientTelemetryEvents()
    .filter((event) => isSyncEvent(event.name))
    .slice(0, 20);

  const handleClear = () => {
    clearClientTelemetryEvents();
    setRefreshTick((tick) => tick + 1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setRefreshTick((tick) => tick + 1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="sync-diagnostics-btn">
          {_t("sync.diagnostics.open")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{_t("sync.diagnostics.title")}</DialogTitle>
          <DialogDescription>
            {_t("sync.diagnostics.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTick((tick) => tick + 1)}
            data-testid="sync-diagnostics-refresh"
          >
            {_t("sync.diagnostics.refresh")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClear}
            data-testid="sync-diagnostics-clear"
          >
            {_t("sync.diagnostics.clear")}
          </Button>
        </div>

        <ScrollArea className="h-[340px] rounded-md border p-2">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {_t("sync.diagnostics.empty")}
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-md border px-3 py-2 text-xs"
                  data-testid={`sync-event-${event.id}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-muted-foreground">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>

                  <div className="mt-1 text-muted-foreground">
                    {_t("sync.diagnostics.level")}: {event.level}
                  </div>

                  <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-2 text-[11px] leading-snug">
                    {toPrettyJson(event.payload || {})}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SyncDiagnosticsModal;
