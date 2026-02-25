import { GENERATE_PDF_API } from "@/lib/variables";
import { toApiErrorMessage } from "@/lib/contracts/invoiceApi";
import { InvoiceType } from "@/types";

type GeneratePdfRequestMessage = {
  type: "generate-pdf";
  requestId: string;
  endpoint: string;
  payload: InvoiceType;
};

type GeneratePdfSuccessMessage = {
  type: "generate-pdf-success";
  requestId: string;
  arrayBuffer: ArrayBuffer;
};

type GeneratePdfErrorMessage = {
  type: "generate-pdf-error";
  requestId: string;
  error: string;
};

type WorkerResponseMessage = GeneratePdfSuccessMessage | GeneratePdfErrorMessage;

type PendingRequest = {
  resolve: (blob: Blob) => void;
  reject: (error: Error) => void;
};

let sharedWorker: Worker | null = null;
const pendingRequests = new Map<string, PendingRequest>();

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const directGeneratePdf = async (
  payload: InvoiceType,
  endpoint: string
): Promise<Blob> => {
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorPayload: unknown = null;
    try {
      errorPayload = await response.json();
    } catch {
      // no-op
    }
    throw new Error(
      toApiErrorMessage(errorPayload, `PDF generation failed (${response.status})`)
    );
  }

  return response.blob();
};

const isWorkerSupported = () => {
  return typeof window !== "undefined" && typeof Worker !== "undefined";
};

const getWorker = () => {
  if (!isWorkerSupported()) return null;
  if (sharedWorker) return sharedWorker;

  const worker = new Worker(new URL("./invoicePdf.worker.ts", import.meta.url));
  worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
    const message = event.data;
    if (!message || !("requestId" in message)) return;

    const pending = pendingRequests.get(message.requestId);
    if (!pending) return;

    pendingRequests.delete(message.requestId);

    if (message.type === "generate-pdf-success") {
      pending.resolve(new Blob([message.arrayBuffer], { type: "application/pdf" }));
      return;
    }

    pending.reject(new Error(message.error));
  };

  sharedWorker = worker;
  return worker;
};

const generatePdfWithWorker = (payload: InvoiceType, endpoint: string) => {
  const worker = getWorker();
  if (!worker) return null;

  return new Promise<Blob>((resolve, reject) => {
    const requestId = createRequestId();
    pendingRequests.set(requestId, { resolve, reject });

    const request: GeneratePdfRequestMessage = {
      type: "generate-pdf",
      requestId,
      endpoint,
      payload,
    };

    worker.postMessage(request);
  });
};

export const generatePdfBlob = async (
  payload: InvoiceType,
  endpoint = GENERATE_PDF_API
) => {
  try {
    const workerResult = generatePdfWithWorker(payload, endpoint);
    if (workerResult) {
      return await workerResult;
    }
  } catch {
    // Worker path failed. Continue with direct request fallback.
  }

  return directGeneratePdf(payload, endpoint);
};
