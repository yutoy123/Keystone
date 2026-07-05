# Documentation Pathway Navigator

**Code for Community Challenge — SDG 11 & SDG 16**

## The Problem

Millions of people face a hidden bureaucratic deadlock: you need a government ID to get a birth certificate, but you need a birth certificate to get a government ID. For people experiencing homelessness, displacement, or housing instability, this loop blocks access to shelter beds, bank accounts, jobs, and basic services — not because the services are unavailable, but because the paperwork to prove who you are is unreachable.

Caseworkers and legal aid staff already know how to navigate these deadlocks case by case, but the process is manual, slow, and depends entirely on individual staff knowledge of constantly-changing local rules.

**Documentation Pathway Navigator** is a tool built *for* those caseworkers — turning a client's documentation situation into an instant, accurate pathway, and auto-generating the exact letter needed to break the deadlock.

## How It Answers the Prompt

*"How can we use technology to strengthen communities and improve the lives of people where they live?"*

This tool strengthens communities by amplifying the people already holding them together — caseworkers, shelter staff, legal aid workers — giving them a faster, more reliable way to unblock the administrative wall that keeps clients from stabilizing in their own community.

## SDG Alignment

- **SDG 16.9** — Provide legal identity for all, including birth registration. This is the core target the tool is built around: treating the *absence* of identity documentation as the problem to solve.
- **SDG 16.3** — Promote the rule of law and ensure equal access to justice for all. Undocumented individuals can't access legal protections without ID; restoring documentation is a precondition for exercising basic rights.
- **SDG 16.6** — Develop effective, accountable, and transparent institutions. By making opaque bureaucratic requirements legible, the tool makes existing institutions more accessible rather than replacing them.
- **SDG 11.1** — Ensure access to adequate, safe, affordable housing and basic services. Shelter intake, banking, and school enrollment all gate on documentation this tool helps secure.

## How It Works

1. **Caseworker selects the client's goal** (e.g., accessing a shelter bed)
2. **Answers a short intake** about what documents the client currently has
3. **The rules engine evaluates the pathway** — including detecting circular "deadlocks" where one required document depends on another the client doesn't have
4. **If a deadlock is detected**, the tool auto-generates a fillable **Caseworker Identity Verification Letter** (PDF) — the exact document needed to unlock the workaround (e.g., a notarized Certification of Identity accepted in lieu of standard ID)
5. **A client-facing summary** can be printed or sent via SMS so the client walks away with something physical

## Current Scope (MVP)

This prototype fully implements the **"Accessing a Shelter Bed"** pathway for **California, USA**, including:
- Standard intake (valid ID)
- Expired-ID path (HUD emergency shelter protections)
- No-ID-but-has-birth-certificate path (DMV state ID + fee waiver)
- **No-ID-and-no-birth-certificate deadlock** (Certification of Identity workaround + auto-generated letter)

Additional goals (bank account, school enrollment, housing) are scaffolded in the UI and are the next build priority — the rules engine architecture (`src/data/rulesEngine.js`) is designed to extend to new goals and states without rewriting the app.

## Tech Stack

- React + Vite
- Tailwind CSS
- jsPDF (in-browser PDF generation — no backend required)

## Running Locally

```bash
npm install
npm run dev
```

## Important Note

This tool provides informational guidance based on publicly available policy (HUD CoC/ESG guidelines, California Vehicle Code §14902, county Vital Records provisions). It is **not legal advice**, and local requirements vary and change — always verify current policy with the receiving agency before relying on generated documents.

## Sources

- HUD Emergency Solutions Grant (ESG) Program regulations
- California Vehicle Code §14902 (fee waiver for individuals experiencing homelessness)
- County Vital Records "Certification of Identity" provisions (verified per-county; subject to change)
