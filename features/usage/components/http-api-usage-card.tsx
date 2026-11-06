import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getOrigin } from "@/shared/server/get-origin";

import { CopyButton } from "./copy-button";

export async function HttpApiUsageCard() {
  const origin = await getOrigin();
  const curl = `curl -X POST ${origin}/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "hello", "count": 5}'`;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">HTTP API</CardTitle>
        <CardAction>
          <CopyButton text={curl} label="curl" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">{curl}</pre>
      </CardContent>
    </Card>
  );
}
