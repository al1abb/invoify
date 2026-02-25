import { describe, expect, it } from "vitest";

import {
  CUSTOMER_TEMPLATES_KEY_V1,
  CUSTOMER_TEMPLATES_KEY_V2,
  readCustomerTemplates,
  writeCustomerTemplates,
} from "@/lib/storage/customerTemplates";

describe("customer templates storage", () => {
  it("migrates v1 array payload to v2 envelope", () => {
    window.localStorage.setItem(
      CUSTOMER_TEMPLATES_KEY_V1,
      JSON.stringify([
        {
          id: "template-1",
          name: "Client A",
          createdAt: 1,
          updatedAt: 2,
          sender: { name: "Sender A" },
          receiver: { name: "Receiver A" },
        },
      ])
    );

    const records = readCustomerTemplates();

    expect(records).toHaveLength(1);
    expect(records[0].name).toBe("Client A");
    expect(window.localStorage.getItem(CUSTOMER_TEMPLATES_KEY_V1)).toBeNull();

    const migratedRaw = window.localStorage.getItem(CUSTOMER_TEMPLATES_KEY_V2);
    expect(migratedRaw).not.toBeNull();

    const migrated = JSON.parse(String(migratedRaw));
    expect(migrated.version).toBe(2);
    expect(migrated.records[0].id).toBe("template-1");
  });

  it("backs up corrupted v2 template payload", () => {
    window.localStorage.setItem(CUSTOMER_TEMPLATES_KEY_V2, "{oops");

    const records = readCustomerTemplates();

    expect(records).toEqual([]);
    expect(window.localStorage.getItem(CUSTOMER_TEMPLATES_KEY_V2)).toBeNull();

    const backupKey = Object.keys(window.localStorage).find((key) =>
      key.startsWith("invoify:backup:customer_templates:")
    );
    expect(backupKey).toBeTruthy();
  });

  it("writes templates as v2 envelope", () => {
    const wrote = writeCustomerTemplates([
      {
        id: "template-2",
        name: "Client B",
        createdAt: 1,
        updatedAt: 3,
        sender: {
          name: "",
          address: "",
          zipCode: "",
          city: "",
          country: "",
          email: "",
          phone: "",
          customInputs: [],
        },
        receiver: {
          name: "",
          address: "",
          zipCode: "",
          city: "",
          country: "",
          email: "",
          phone: "",
          customInputs: [],
        },
      },
    ]);

    expect(wrote).toBe(true);

    const raw = window.localStorage.getItem(CUSTOMER_TEMPLATES_KEY_V2);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(String(raw));
    expect(parsed.version).toBe(2);
    expect(parsed.records[0].name).toBe("Client B");
  });
});
