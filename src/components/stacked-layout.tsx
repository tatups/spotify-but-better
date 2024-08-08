import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/16/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import { type Session } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import NavigationMenuItem from "./navigation-menu-item";
import SpotifyContextWindow from "./spotify/context-window";
import PlaybackInfo from "./spotify/playback-info";
import SearchField from "./spotify/search/search-view";
import Sidebar from "./spotify/sidebar";

const userNavigation = [
  { name: "Your Profile", href: "#", onClick: undefined },
  { name: "Settings", href: "#", onClick: undefined },
  { name: "Sign out", href: undefined, onClick: undefined },
];

interface StackedLayoutProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function StackedLayout({
  children,
  session,
}: StackedLayoutProps) {
  const user = session?.user;

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <SpotifyContextWindow>
        <div
          className="grid max-h-screen min-h-full"
          style={{ gridTemplateRows: "auto 1fr auto" }}
        >
          <nav className="bg-fuchsia-800 text-yellow-500">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div></div>
                <SearchField />
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {!!session?.user?.image ? (
                          <Image
                            alt=""
                            src={session?.user?.image ?? ""}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserIcon className="h-8 w-8 rounded-full text-gray-400" />
                        )}
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <NavigationMenuItem item={item} key={item.name} />
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </nav>
          <div className="flex divide-x-2 divide-pink-800 overflow-auto bg-fuchsia-600">
            <div className="w-80 shrink-0 overflow-auto bg-fuchsia-600 text-yellow-500">
              <Sidebar />
            </div>
            <div className="w-full max-w-7xl overflow-auto bg-fuchsia-600 py-10">
              <main className="">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
              </main>
            </div>
          </div>

          <footer className="">
            <PlaybackInfo />
          </footer>
        </div>
      </SpotifyContextWindow>
    </>
  );
}
