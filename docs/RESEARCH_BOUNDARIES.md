# Research boundaries

This document states what the MoneyMentor prototype may and may not do. It applies to
all contributors and all AI coding assistants. When in doubt, don't — ask the project lead.

## Current status

- **No human-subject research approval is assumed.** No IRB determination, data use
  agreement, or institutional authorization exists in this repository's context.
- **No production deployment is authorized.**
- **Development uses fictional data only.** No real students, participants, or financial
  records may be entered, imported, or stored — including in tests, seeds, screenshots,
  logs, or prompts sent to model providers.

## Prohibited capabilities (always)

The system must never:
- Access bank, card, loan-servicer, or any financial accounts or transactions.
- Initiate, authorize, or block payments, purchases, or transfers.
- Apply for loans, credit cards, or any financial product, or recommend specific products.
- Make lending, investment, or other financial decisions for a student.
- Present itself as providing professional financial, legal, tax, or mental-health advice.
- Use sensitive personal context without the student's explicit, recorded consent.
- Modify its own safety rules, prompts in production, or tool permissions.

## Permitted (prototype)

- Educational explanations of financial concepts.
- Calculations on **hypothetical** values the student types in, with stated assumptions.
- Comparing scenarios and naming trade-offs — without telling the student what to choose.
- Pointing to **verified** resources from a curated list, with verification dates.
- Referring to human help (financial aid office, basic-needs services, nonprofit counseling,
  crisis lines where appropriate).

## Research conditions

The proposal describes three randomized conditions. The platform may be *architected* to
support them (see `ARCHITECTURE.md` §7), but the following are **not implemented and must
not be built** without research-team and IRB approval:
- Participant enrollment, eligibility screening, or consent-to-research flows
- Randomization or condition assignment of real people
- Outcome surveys (e.g., CFPB Financial Well-Being Scale) on real people
- Micro-randomized intervention delivery to real people
- Export of research datasets

Product-level consent (e.g., "may the assistant use my rent amount for this calculation?")
is a software feature and is in scope. It is **not** research informed consent.

## Claims

- Engineering tests and agent evals measure **system behavior** (accuracy, policy
  compliance, latency, cost). They say nothing about student knowledge, behavior, stress,
  or financial well-being.
- Do not describe the prototype as improving financial outcomes. That requires the
  separately approved study described in the proposal.

## Data handling defaults

- Data minimization: collect only what a feature needs, and say why in the UI.
- Do not log full prompts, model outputs, or conversations in workflow tools (n8n) or
  application logs by default. Log IDs, metrics, and summaries.
- Students can inspect, correct, export, and delete their profile data (design target).
- Model-provider usage must be reviewed for data-retention terms before any non-fictional
  data could ever be sent.

## Before any real-person use — checklist (owned by the research team)

- [ ] IRB determination/approval for the specific protocol
- [ ] Institutional data security review and data classification
- [ ] Model-provider data processing terms reviewed (retention, training use)
- [ ] Authentication via institutional identity provider
- [ ] Verified resource directory with named maintainers
- [ ] Accessibility review (WCAG 2.2 AA)
- [ ] Safety red-team and subgroup fairness audit completed
- [ ] Escalation paths confirmed with campus services
- [ ] Consumer financial-protection review (CFPB has stated AI use does not exempt
      covered entities from consumer financial-protection law)
