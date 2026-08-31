import { promises as fs } from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { build as buildServer } from "tsup";
import { build as buildWidget } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = process.cwd();
const pluginMcp = path.join(root, "plugins/kth-study/mcp");
const temporaryWidget = path.join(root, ".plugin-build/widget");
const widgetDestination = path.join(pluginMcp, "study-explainer-widget.html");
const serverDestination = path.join(pluginMcp, "server.mjs");

await fs.mkdir(pluginMcp, { recursive: true });
await buildWidget({
  root: path.join(root, "src/widget"),
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: temporaryWidget,
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  logLevel: "warn",
});
await fs.copyFile(path.join(temporaryWidget, "index.html"), widgetDestination);

await buildServer({
  entry: [path.join(root, "src/mcp/server.ts")],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: pluginMcp,
  outExtension: () => ({ js: ".mjs" }),
  bundle: true,
  noExternal: [/.*/],
  banner: {
    js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
  },
  clean: false,
  sourcemap: false,
  splitting: false,
  silent: true,
});

for (const file of [serverDestination, widgetDestination]) {
  const output = await fs.readFile(file, "utf8");
  await fs.writeFile(file, `${output.replace(/[ \t]+$/gm, "").trimEnd()}\n`, "utf8");
}
const widget = await fs.readFile(widgetDestination, "utf8");
if (/(?:src|href)=["']https:\/\/(?!127\.0\.0\.1)/i.test(widget)) {
  throw new Error("Plugin widget contains an external HTTPS asset reference.");
}
await fs.rm(path.join(root, ".plugin-build"), { recursive: true, force: true });
console.log(JSON.stringify({
  status: "built",
  server: path.relative(root, serverDestination),
  widget: path.relative(root, widgetDestination),
}));
