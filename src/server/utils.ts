import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";

export async function getSpotifyAccessToken() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    //redirect to login page
    redirect("/api/auth/signin");
  }

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, session.user.id),
  });

  if (!account) {
    redirect("/api/auth/signin");
  }
  if ((account.expires_at ?? 0) < new Date().getTime() / 1000) {
    redirect("/api/auth/signin");
  }

  return account.access_token;
}
