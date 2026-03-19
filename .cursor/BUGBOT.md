# Invoify Bugbot rules

For invoice export changes, flag these as high-signal issues:

- The exported payload format, file extension, and Content-Type must all match the requested export type.
- Unsupported export types must return an explicit 4xx error. Never silently fall back to another format.
- Spreadsheet exports must preserve invoice line items in a readable form. Flag cases where arrays or objects would serialize incorrectly or opaquely.
- Client download flows must not treat failed HTTP responses as successful downloads.