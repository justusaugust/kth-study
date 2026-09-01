import { RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const EXPLAINER_WIDGET_URI =
  "ui://widget/kth-study-explainer-0.2.1.html";
export const EXPLAINER_WIDGET_MIME = RESOURCE_MIME_TYPE;

const logoPath = [
  "plugins/kth-study/assets/kth-study.png",
  "assets/kth-study.png",
].map((candidate) => path.resolve(candidate)).find(existsSync);
const iconPath = [
  "plugins/kth-study/assets/kth-study-small.svg",
  "assets/kth-study-small.svg",
].map((candidate) => path.resolve(candidate)).find(existsSync);
if (!iconPath || !logoPath) throw new Error("KTH Study icon is missing.");

export const KTH_STUDY_ICONS = [
  {
    src: `data:image/svg+xml;base64,${readFileSync(iconPath).toString("base64")}`,
    mimeType: "image/svg+xml",
    sizes: ["24x24"],
  },
  {
    src: `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`,
    mimeType: "image/png",
    sizes: ["512x512"],
  },
];

export const EXPLAINER_WIDGET_META = {
  ui: {
    resourceUri: EXPLAINER_WIDGET_URI,
    visibility: ["model"],
  },
  "openai/outputTemplate": EXPLAINER_WIDGET_URI,
  "openai/toolInvocation/invoking": "Opening visual…",
  "openai/toolInvocation/invoked": "Visual ready",
} as const;
