import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getOrigin } from "@/shared/server/get-origin";

import { CopyButton } from "./copy-button";

export async function McpUsageCard() {
  const origin = await getOrigin();
  const mcpUrl = origin ? `${origin}/mcp` : "";
  const mcpJson = `{
  "mcpServers": {
    "sparelay": {
      "url": "${mcpUrl}",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">MCP endpoint</CardTitle>
        <CardAction>
          <CopyButton text={mcpJson} label="MCP config" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">{mcpJson}</pre>
      </CardContent>
    </Card>
  );
}
