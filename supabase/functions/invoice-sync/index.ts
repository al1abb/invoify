// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SavedInvoiceRecord = {
  id: string;
  invoiceNumber: string;
  status: "draft" | "sent" | "paid";
  createdAt: number;
  updatedAt: number;
  data: Record<string, unknown>;
};

type CustomerTemplateRecord = {
  id: string;
  name: string;
  sender: Record<string, unknown>;
  receiver: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
};

type InvoiceSyncSnapshot = {
  reason: string;
  timestamp: number;
  savedInvoices: SavedInvoiceRecord[];
  customerTemplates: CustomerTemplateRecord[];
};

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isValidSavedInvoiceRecord = (value: unknown): value is SavedInvoiceRecord => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.invoiceNumber === "string" &&
    (value.status === "draft" || value.status === "sent" || value.status === "paid") &&
    typeof value.createdAt === "number" &&
    typeof value.updatedAt === "number" &&
    isObject(value.data)
  );
};

const isValidCustomerTemplateRecord = (
  value: unknown
): value is CustomerTemplateRecord => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.createdAt === "number" &&
    typeof value.updatedAt === "number" &&
    isObject(value.sender) &&
    isObject(value.receiver)
  );
};

const parseSnapshot = (value: unknown): InvoiceSyncSnapshot | null => {
  if (!isObject(value)) return null;

  const savedInvoices = Array.isArray(value.savedInvoices) ? value.savedInvoices : null;
  const customerTemplates = Array.isArray(value.customerTemplates)
    ? value.customerTemplates
    : null;

  if (
    typeof value.reason !== "string" ||
    typeof value.timestamp !== "number" ||
    !savedInvoices ||
    !customerTemplates
  ) {
    return null;
  }

  if (!savedInvoices.every(isValidSavedInvoiceRecord)) {
    return null;
  }

  if (!customerTemplates.every(isValidCustomerTemplateRecord)) {
    return null;
  }

  return {
    reason: value.reason,
    timestamp: value.timestamp,
    savedInvoices,
    customerTemplates,
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: jsonHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: jsonHeaders,
      }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Supabase environment is not configured" }),
      {
        status: 500,
        headers: jsonHeaders,
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        status: 400,
        headers: jsonHeaders,
      }
    );
  }

  const snapshot = parseSnapshot(body);
  if (!snapshot) {
    return new Response(
      JSON.stringify({ error: "Invalid sync payload" }),
      {
        status: 400,
        headers: jsonHeaders,
      }
    );
  }

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : "";

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing bearer token" }),
      {
        status: 401,
        headers: jsonHeaders,
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: authError?.message || "Unauthorized" }),
      {
        status: 401,
        headers: jsonHeaders,
      }
    );
  }

  const payloadString = JSON.stringify(snapshot);
  const payloadBytes = new TextEncoder().encode(payloadString).length;

  const { error: upsertError } = await supabase
    .from("invoice_sync_snapshots")
    .upsert(
      {
        user_id: user.id,
        reason: snapshot.reason,
        snapshot_timestamp: snapshot.timestamp,
        saved_invoices: snapshot.savedInvoices,
        customer_templates: snapshot.customerTemplates,
        payload_bytes: payloadBytes,
      },
      {
        onConflict: "user_id",
      }
    );

  if (upsertError) {
    return new Response(
      JSON.stringify({ error: upsertError.message }),
      {
        status: 500,
        headers: jsonHeaders,
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      userId: user.id,
      snapshotTimestamp: snapshot.timestamp,
      payloadBytes,
      savedInvoices: snapshot.savedInvoices.length,
      customerTemplates: snapshot.customerTemplates.length,
    }),
    {
      status: 200,
      headers: jsonHeaders,
    }
  );
});
