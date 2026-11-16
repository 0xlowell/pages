import type { ComponentType } from "react";
import { AccessSchematic, HybridSchematic, WorkspaceSchematic } from "../components/Schematics";
import HybridCase from "../projects/hybrid";
import AccessCase from "../projects/access";
import WorkspacesCase from "../projects/workspaces";

export type Project = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  stage: string;
  lede: string;
  facts: { label: string; value: string }[];
  Art: ComponentType;
  Body: ComponentType;
};

export const projects: Project[] = [
  {
    slug: "hybrid-automation",
    title: "Hybrid automation harness",
    role: "Proposed the architecture",
    summary:
      "Automating a business application through its screens without asking a model to decide every click. Explore with an agent, replay validated journeys as procedures, and call the model back only for the step that needs it.",
    stage: "Early, about a month in. Cost and robustness are design goals, not measured results.",
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
    role: "Proposed the solution",
    summary:
      "A shared layer where applications declare business permissions and roles, with a visual map of who can do what. Sign-in stays with the identity provider, and the backend enforces every decision.",
    stage: "Connected local pilot with real Microsoft sign-in and a first application. Not an organisation-wide rollout.",
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
    title: "AI workspaces and product workflows",
    role: "Continuing existing products",
    summary:
      "Contributing to a shared employee AI workspace and an assisted product-intake service: durable conversations, governed tools, reviewed proposals, and recovery after interruptions.",
    stage: "Ongoing development and integration of existing products.",
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
