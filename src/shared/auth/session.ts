import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";

import { configuredKey } from "./config";
import { resolveCookieSecure } from "./cookie-secure";

export const SESSION_COOKIE = "sg_session";
const SESSION_MAX_AGE = 60 * 60 * 24;

interface SessionData {
  authed?: boolean;
}

async function sessionOptions() {
  const h = await headers();
  return {
    password: configuredKey(),
    cookieName: SESSION_COOKIE,
    ttl: SESSION_MAX_AGE,
    cookieOptions: {
      httpOnly: true,
      sameSite: "strict" as const,
      path: "/",
      secure: resolveCookieSecure(h.get("x-forwarded-proto")),
    },
  };
}

export async function createSession(): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), await sessionOptions());
  session.authed = true;
  await session.save();
}

export async function requireSession(): Promise<boolean> {
  try {
    const session = await getIronSession<SessionData>(await cookies(), await sessionOptions());
    return session.authed === true;
  } catch {
    return false;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const session = await getIronSession<SessionData>(await cookies(), await sessionOptions());
    session.destroy();
  } catch {}
}
