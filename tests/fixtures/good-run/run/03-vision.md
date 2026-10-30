# Vision: Fatoora Solo (working name)

Source: Qanas run 2026-10-30-test-run, IDEA-1, written 2026-10-30.

Fatoora Solo lets a Saudi freelancer issue a compliant invoice in two minutes.

## Who it is for
- **PER-1 Solo freelancer:** designer or developer; top three pains: manual invoices, portal setup, slow support; top three gains: speed, compliance, low cost. Primary user and buyer. Source: https://forum.example.com/t/1 (2026-10-30).

## The problem
- **JOB-1 (PER-1):** issue a compliant invoice for each client job. Outcome: Minimize the time it takes to issue a compliant invoice. Source: https://forum.example.com/t/1 (2026-10-30).

## What it must do
1. Connect once to the tax portal.
2. Issue and clear an invoice.
3. See each invoice's status.

**Later (not in the first version):** credit notes.

## Out of scope
- Payroll
- Inventory
- Mobile apps

## Hard constraints
- Arabic first. Source: https://forum.example.com/t/1 (2026-10-30).

## Why now
A reporting deadline is coming (https://alpha.example.net/pricing, 2026-10-30).

## Success looks like
- An invoice is issued in under two minutes.

## Suggested Itqan scale
MVP: first real users. Itqan runs Constitution, Product Spec, UX, Technical Design, Plan, Build and Acceptance at MVP; Discovery runs only at Full product.

## Appendix A: Market evidence

### Competitors
| ID | Name | Level | What it does for these needs | URL | Accessed |
|----|------|-------|------------------------------|-----|----------|
| COMP-1 | Alpha Books | direct | Paid e-invoicing | https://alpha.example.net/pricing | 2026-10-30 |
| COMP-2 | Spreadsheet | substitute | Manual invoices | https://forum.example.com/t/1 | 2026-10-30 |

### Feature matrix

| Feature | Kano | COMP-1 | COMP-2 | Table stakes |
|---------|------|--------|--------|--------------|
| QR code on invoice | must-be | Strong (https://alpha.example.net/pricing, 2026-10-30) | Weak (https://forum.example.com/t/1, 2026-10-30) | yes |
| Portal clearance | must-be | Adequate (https://alpha.example.net/pricing, 2026-10-30) | Absent (https://forum.example.com/t/1, 2026-10-30) | no |

### Table stakes: rulings
- QR code on invoice: ruling: pending

## Appendix B: Assumptions and open questions
- **Riskiest assumption:** freelancers will switch from spreadsheets. **Cheapest test:** landing page; pass at 30 sign-ups.
