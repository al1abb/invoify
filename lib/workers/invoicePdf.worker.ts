/// <reference lib="webworker" />

type GeneratePdfRequest = {
  type: "generate-pdf";
  requestId: string;
  endpoint: string;
  payload: unknown;
};

type GeneratePdfSuccess = {
  type: "generate-pdf-success";
  requestId: string;
  arrayBuffer: ArrayBuffer;
};

type GeneratePdfError = {
  type: "generate-pdf-error";
  requestId: string;
  error: string;
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

self.onmessage = async (event: MessageEvent<GeneratePdfRequest>) => {
  const message = event.data;
  if (!message || message.type !== "generate-pdf") return;

  try {
    const response = await fetch(message.endpoint, {
      method: "POST",
      body: JSON.stringify(message.payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed (${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();

    const success: GeneratePdfSuccess = {
      type: "generate-pdf-success",
      requestId: message.requestId,
      arrayBuffer,
    };

    self.postMessage(success, [arrayBuffer]);
  } catch (error) {
    const failure: GeneratePdfError = {
      type: "generate-pdf-error",
      requestId: message.requestId,
      error: toErrorMessage(error),
    };

    self.postMessage(failure);
  }
};

export {};
