import type { ComponentType } from "react";
import { AccessSchematic, HybridSchematic, WorkspaceSchematic } from "../components/Schematics";
import HybridCase from "../projects/hybrid";
import AccessCase from "../projects/access";
import WorkspacesCase from "../projects/workspaces";

export type Project = {
  slug: string;
  title: string;
  role: string;
  // Home page
  body: string;
  parts: { term: string; text: string }[];
  stage: string;
  more: string;
  // Case study
  lede: string;
  facts: { label: string; value: string }[];
  Art: ComponentType;
  Body: ComponentType;
};

export const projects: Project[] = [
  {
    slug: "hybrid-automation",
    title: "Hybrid automation harness",
    role: "I proposed the architecture",
    body: "A business application has to be operated through its screens, on Windows over Citrix. The plan on the table was continuous computer use: take a screenshot, ask a model, click, repeat. I argued against making that the default. A coding-agent CLI becomes the harness and explores the application with a person guiding it. Journeys we understand are written down as deterministic procedures. Procedures run by default, and a model is called back only for the step that fails or the screen nobody has seen, then hands control back.",
    parts: [
      {
        term: "Evidence",
        text: "A review lab lines up events, screenshots, video and model and tool calls for each run. Proposed, executed and confirmed are three separate facts, and missing evidence stays unknown instead of counting as success.",
      },
      {
        term: "Unattended runs",
        text: "Versioned distribution, a work queue, bounded retries, a check after each action, and protection against doing the same action twice.",
      },
      {
        term: "Hand-over",
        text: "Named failure states decide when a procedure stops and what the model is given, so the fallback is targeted instead of open-ended.",
      },
    ],
    stage: "Early, about a month in. It is designed for lower inference cost and better robustness; I have not measured either yet.",
    more: "Longer write-up, with a run you can step through",
    lede: "How to automate a business application through its screens without asking a model to decide every click.",
    facts: [
      { label: "My part", value: "Questioned the original design and proposed this architecture" },
      { label: "Stage", value: "Early, about a month in" },
      { label: "Setting", value: "Business application on Windows and Citrix" },
    ],
    Art: HybridSchematic,
    Body: HybridCase,
  },
  {
    slug: "application-authorization",
    title: "Application authorization",
    role: "I proposed the solution",
    body: "The question brought to me: who can do what, across a growing number of internal applications. I proposed a shared authorization layer with a visual workspace on top. The identity provider keeps answering who you are. This layer answers what you may do.",
    parts: [
      {
        term: "Model",
        text: "Applications declare their own permissions. Roles combine permissions, and assignments give a role to a person or a group within a scope.",
      },
      {
        term: "Enforcement",
        text: "Every decision is made and logged on the server. The map shows relationships; rearranging it grants nothing.",
      },
      {
        term: "Separate powers",
        text: "Managing access and using business data are different rights. Authority comes from explicit mandates and bounded delegation, not from the org chart.",
      },
    ],
    stage: "A connected local pilot: catalog, roles, individual and group assignments, server-side decisions, an audit trail, a first consuming application, and real Microsoft sign-in. Delegation rules and rollout are in progress.",
    more: "Longer write-up, with a map you can click through",
    lede: "A shared way for applications to manage business permissions, with a map that makes the relationships visible.",
    facts: [
      { label: "My part", value: "The problem was brought to me; I proposed the solution" },
      { label: "Stage", value: "Connected local pilot" },
      { label: "Scope", value: "Shared across applications, not yet organisation-wide" },
    ],
    Art: AccessSchematic,
    Body: AccessCase,
  },
  {
    slug: "ai-workspaces",
    title: "AI workspace and product intake",
    role: "Existing products; I work on both",
    body: "Two products I did not start. The first is an employee AI workspace: persistent conversations, authorized business tools, files, and interactive pages generated from data the person is allowed to see. The second helps employees turn a need into a structured request: an assistant proposes changes to the form, a person reviews and submits.",
    parts: [
      {
        term: "State that survives",
        text: "Conversations persist across reloads, a dropped stream reconnects to the run still in progress, and interrupted uploads recover.",
      },
      {
        term: "Once-only effects",
        text: "An assistant's proposal is applied exactly once, however many times the client retries.",
      },
      {
        term: "Boundaries",
        text: "The server owns identity, permissions, history and execution state. A generated page can only present data its reader is authorized to see, and helping to write a request never grants the right to submit it.",
      },
    ],
    stage: "Ongoing development, and the integration between the two.",
    more: "Longer write-up",
    lede: "Two existing products that connect people, conversational AI and application actions.",
    facts: [
      { label: "My part", value: "Continuing development and integration of existing products" },
      { label: "Stage", value: "Ongoing" },
      { label: "Parts", value: "Employee AI workspace, assisted product intake" },
    ],
    Art: WorkspaceSchematic,
    Body: WorkspacesCase,
  },
];
