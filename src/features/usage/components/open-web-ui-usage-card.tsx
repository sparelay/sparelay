import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getOrigin } from "@/shared/server/get-origin";

import { CopyButton } from "./copy-button";

export async function OpenWebUIUsageCard() {
  const origin = await getOrigin();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">OpenWebUI</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Open Admin Settings → Web Search</li>
          <li>Turn Web Search on and set Web Search Engine to External</li>
          <li>Set the URL and API key below, then save</li>
        </ol>
        <div className="flex items-center justify-between gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 text-xs">
            {`${origin}/search`}
          </code>
          <CopyButton text={`${origin}/search`} label="URL" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 text-xs">
            API key: same as gateway API_KEY
          </code>
          <CopyButton text="YOUR_API_KEY" label="API key" />
        </div>
      </CardContent>
    </Card>
  );
}
