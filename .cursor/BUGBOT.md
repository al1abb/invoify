# Invoify Bugbot rules

For invoice export changes, flag these as important:
- Content-Type, Content-Disposition filename, and requested export format must match.
- Unsupported export types must return an explicit 4xx error.
- Do not silently fall back to another export format.