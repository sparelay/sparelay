import { requireSessionOrRedirect } from "@/shared/auth/guard";
import { SiteHeader } from "@/shared/components/site-header";

import packageJson from "../../../package.json";

interface Props {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: Props) {
  await requireSessionOrRedirect();
  return (
    <>
      <SiteHeader version={packageJson.version} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </>
  );
}
