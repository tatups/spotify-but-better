"use client";

import { signIn, signOut } from "next-auth/react";
import React from "react";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const onSignIn = () => {
    const res = signIn(provider);
    console.log(res, "onSignIn");
  };

  return (
    // <form
    //   action={(e) => {
    //     signIn(provider);
    //   }}
    // >
    <button onClick={onSignIn} {...props}>
      Sign In with {provider}
    </button>
    // </form>
  );
}

export function SignOut(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    // <form
    //   action={async () => {
    //     "use server";
    //     await signOut();
    //   }}
    //   className="w-full"
    // >
    <button onClick={() => signOut()} {...props}>
      Sign Out
    </button>
    // </form>
  );
}
