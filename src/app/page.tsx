import { SignIn, SignOut } from "~/components/auth-components";
import SessionData from "~/components/session-data";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-3xl">HEhe</h1>

        {!session?.user && (
          <SignIn provider="spotify" className="btn btn-primary">
            Sign In with Spotify
          </SignIn>
        )}
        {session?.user && <SignOut className="btn btn-secondary" />}

        <SessionData session={session} />
      </div>
    </main>
  );
}
