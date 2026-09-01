import { serve } from "@hono/node-server";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { createStudyContext } from "../server/context";
import {
  EXPLAINER_WIDGET_MIME,
  EXPLAINER_WIDGET_URI,
} from "./resources";
import { createKthStudyServer } from "./server";

describe("KTH Study MCP protocol", () => {
  it("lists tools and serves the self-contained explainer resource", async () => {
    const context = await createStudyContext(
      path.resolve("tests/fixtures/corpus"),
    );
    const server = createKthStudyServer(
      context,
      "<!doctype html><title>KTH Study</title>",
    );
    const client = new Client({ name: "test-client", version: "0.1.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toContain("show_visual");
    expect(client.getServerVersion()?.icons).toMatchObject([
      {
        src: expect.stringMatching(/^data:image\/svg\+xml;base64,/),
        mimeType: "image/svg+xml",
        sizes: ["24x24"],
      },
      {
        src: expect.stringMatching(/^data:image\/png;base64,/),
        mimeType: "image/png",
        sizes: ["512x512"],
      },
    ]);
    expect(tools.tools.every((tool) => tool.outputSchema)).toBe(true);
    expect(tools.tools.every((tool) => tool.annotations?.openWorldHint === false)).toBe(true);
    expect(tools.tools.find((tool) => tool.name === "show_visual")?._meta).toMatchObject({
      ui: { resourceUri: EXPLAINER_WIDGET_URI, visibility: ["model"] },
      "ui/resourceUri": EXPLAINER_WIDGET_URI,
    });

    const resources = await client.listResources();
    expect(resources.resources).toContainEqual(
      expect.objectContaining({ uri: EXPLAINER_WIDGET_URI }),
    );
    const resource = await client.readResource({ uri: EXPLAINER_WIDGET_URI });
    expect(resource.contents[0]).toMatchObject({
      uri: EXPLAINER_WIDGET_URI,
      mimeType: EXPLAINER_WIDGET_MIME,
      _meta: {
        ui: {
          csp: { connectDomains: [], resourceDomains: [] },
          prefersBorder: false,
        },
      },
    });

    const result = await client.callTool({
      name: "show_visual",
      arguments: { id: "explainer:sf1690:quadratic-coefficients" },
    });
    expect(result.structuredContent).toMatchObject({
      url: "/visuals/quadratic-coefficients",
    });

    await client.close();
    await server.close();
  });

  it("serves the same tools over stateless Streamable HTTP", async () => {
    const context = await createStudyContext(path.resolve("tests/fixtures/corpus"));
    const app = createApp(context, "<!doctype html><title>KTH Study</title>");
    const httpServer = serve({ fetch: app.fetch, hostname: "127.0.0.1", port: 0 });
    if (!httpServer.listening) {
      await new Promise<void>((resolve) => httpServer.once("listening", resolve));
    }
    const address = httpServer.address();
    if (!address || typeof address === "string") throw new Error("HTTP test server did not bind.");

    const client = new Client({ name: "http-test-client", version: "0.1.0" });
    try {
      await client.connect(
        new StreamableHTTPClientTransport(
          new URL(`http://127.0.0.1:${address.port}/mcp`),
        ),
      );
      const tools = await client.listTools();
      expect(tools.tools).toHaveLength(10);
      expect(tools.tools.map((tool) => tool.name)).toContain("get_course_dates");
      const result = await client.callTool({
        name: "show_visual",
        arguments: { id: "explainer:sf1690:quadratic-coefficients" },
      });
      expect(result.structuredContent).toMatchObject({
        url: "/visuals/quadratic-coefficients",
      });
    } finally {
      await client.close();
      await new Promise<void>((resolve, reject) =>
        httpServer.close((error) => error ? reject(error) : resolve()),
      );
    }
  });
});
