import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { describe, expect, it } from "vitest";

describe("bundled KTH Study plugin", () => {
  it("serves its widget and stable visual URL over stdio", async () => {
    const transport = new StdioClientTransport({
      command: "node",
      args: [
        path.resolve("plugins/kth-study/mcp/server.mjs"),
        "--stdio",
        "--root",
        path.resolve("tests/fixtures/corpus"),
      ],
    });
    const client = new Client({ name: "plugin-smoke", version: "0.1.0" });
    await client.connect(transport);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toContain("show_visual");
    const resources = await client.listResources();
    const widget = resources.resources.find((resource) =>
      resource.uri.startsWith("ui://widget/kth-study-explainer"),
    );
    expect(widget).toBeDefined();
    const content = await client.readResource({ uri: widget!.uri });
    expect(content.contents[0].mimeType).toBe("text/html;profile=mcp-app");

    const result = await client.callTool({
      name: "show_visual",
      arguments: { id: "explainer:sf1690:quadratic-coefficients" },
    });
    expect(result.structuredContent).toMatchObject({
      id: "explainer:sf1690:quadratic-coefficients",
      url: "/visuals/quadratic-coefficients",
    });

    await client.close();
  });
});
