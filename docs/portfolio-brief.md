# Lowell — anonymized portfolio brief

Self-contained context for an independent portfolio proposal. Facts were reviewed
with Lowell on 13 November 2026. Prepared on 16 November 2026; deployment status
has not been re-audited since that review.

## Purpose

Present Lowell as an AI Engineer to technical hiring managers, engineering peers
and potential collaborators. Explain problems, his contribution, design choices
and current stage. Keep the homepage scannable and put depth in case studies and
useful technical writing. His work spans agent execution, application engineering
and the surrounding platform; one desktop-automation example is not its boundary.

## Public identity and confidentiality

- Use **Lowell** only: page titles, metadata, article bylines and feeds included.
- Contact: **GitHub only**, <https://github.com/0xlowell>. No email or `mailto:`.
- Omit surname, employer/client names, internal product names and repositories.
- No internal screenshots, recordings, addresses, private URLs, account IDs,
  employee identities, credentials or business data.
- Use original abstract diagrams or explicitly fictional examples. Label
  illustrative interactions rather than presenting them as live systems.

The generic names below describe the projects publicly. This brief and the
portfolio are the source material; do not inspect sibling work repositories.

## Hybrid automation harness

**Problem:** operating a business application through Windows/Citrix screens.
The starting approach used continuous computer use: observe, ask a model for an
action, execute, repeat. Familiar journeys raise questions about repeated
inference cost, reliability and diagnosis.

**Lowell's initiative:** he questioned that architecture and proposed
industrializing a coding-agent CLI as the harness. It supplies tools, context,
initial human guidance and delegation to suitable specialized sub-agents.

Explore and formalize interactions with the agent; turn known, validated
journeys into deterministic RPA procedures. Run those procedures by default,
give named failures or unfamiliar states targeted computer-use assistance,
then hand control back to the procedure.

An execution-review laboratory combines event timelines, screenshots, video
synchronized to events, model/tool calls, durations, attempt comparisons and
errors. Proposed action, executed action and confirmed business result are
separate facts. Missing evidence remains unknown. Runtime work includes
versioned distribution, a queue, bounded recovery, checks and duplicate-action
protection.

**Stage:** early work in a mission described as about one month old on
13 November. Lower inference cost and improved robustness are objectives;
no quantified savings or production reliability rate were supplied. Sub-agent
availability is a harness capability, not proof of an unlimited autonomous
fleet. Learning here means guided exploration, corrections and formalized
procedures, not model training or autonomous self-improvement.

## Application authorization and visual access management

**Ownership:** the access-management problem was brought to Lowell.
**He proposed the solution:** a shared application-authorization layer paired
with a visual workspace to understand who can do what.

- The identity provider establishes identity and sign-in conditions; application
  authorization determines business permissions.
- Applications own permission declarations. Roles combine permissions;
  assignments associate roles with people/groups within a scope.
- A map exposes relationships. The backend enforces decisions; layout and
  visibility do not grant authority.
- Managing access and using business data are distinct powers.
- The proposed management model uses explicit mandates and bounded delegation,
  rather than inferring authority from organizational hierarchy.
- Decisions and changes require an audit trail and understandable provenance.

**Stage:** reviewed evidence supported a connected local pilot: catalog, roles,
individual/group assignments, server-side decisions, local audit and a first
consuming application. Real Microsoft sign-in was exercised locally. Broader
delegation semantics and rollout remained in progress. A local authentication
test or visual prototype does not establish organization-wide production use.

## Continuing AI workspaces and product workflows

These are **existing products**. Lowell contributes to continued development
and integration; he does not claim their original architecture.

**Employee AI workspace:** persistent conversations, authorized business tools,
files and interactive pages generated from permitted data. Engineering topics
include saved conversation state, reconnection to an active run, saved-result
context and the boundary between generated presentation and authorized data.
The server owns identity, permissions, conversation history and execution state.

**AI-assisted product intake:** employees describe a need, understand delivery
options and prepare a structured request. An assistant proposes form changes;
a person reviews and submits. Integration includes durable messages/files,
once-only application of proposals, upload/stream recovery and a handoff to
request tracking. Development paths and repository starters support later work.
This is ongoing implementation and integration, not proof of an autonomous
idea-to-production application factory.

## Earlier portfolio work

Preserve substance without adding scope or measured outcomes:

- Context-aware CV matching: hybrid retrieval and document identity reconstructed
  from chunks for comparison of full profiles with job descriptions.
- Private GenAI platform: AKS/Open WebUI, single sign-on and cost controls.
- Visual RAG: charts and diagrams usable in document retrieval.
- Teams/Azure Boards bot: work-item reads and proposed updates with human
  validation before writes.

## Presentation preferences

Lowell wants a clean, contemporary, personal site with substantive projects.
He likes Andrej Karpathy's disciplined, simple and direct presentation, while
finding that site very minimal. Eugene Yan, Hamel Husain and Simon Willison were
also explored for the connection between projects and technical writing.
Use these as references for principles, not layouts to copy.

The first proposal felt like a long academic article: giant serif slogan,
dense homepage and an execution table dominating it. The opening line
“I build AI systems, then check what they actually did” was rejected.
The second introduced project illustrations and case studies but still felt
conventional. A huge first name repeated in a smaller header was explicitly
criticized and has been corrected.

Favor a concise introduction, project hierarchy and meaningful visuals. Keep
depth in case studies and writing. Avoid formulaic AI branding, glows, purple
gradients, decorative terminals, unnecessary animation, badge collections and
generic sales copy. Giant typography and excess whitespace are not substitutes
for composition. Communicate contributions confidently; keep evidence limits
clear without filling the visitor experience with defensive disclaimers.

“Lowell — AI Engineer” is a useful starting introduction. Wording, colors,
layout and project grouping are open to the designer's judgment. Privacy,
contribution accuracy, readability and working navigation are requirements.

## Implementation contract

Next.js App Router, React, Tailwind, static export to GitHub Pages under `/pages`.
The current site has three case studies, three articles, indexes, RSS and
illustrative execution/permission-map interactions. Prefer the existing stack
and a small implementation without new dependencies. Preserve substantive
content and useful interactions while reorganizing them. Maintain semantic
HTML, keyboard focus, reduced motion, contrast and readable mobile layouts.

Use an independent proposal branch/worktree. Do not replace the published
version, push or deploy without an explicit instruction. Implement a reviewable
proposal, run lint and the static build, inspect desktop/mobile views and state
verification limits. Do not turn internal implementation commentary into
visitor-facing content.
