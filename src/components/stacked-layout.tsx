import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
} from "@headlessui/react";
import { UserIcon } from "@heroicons/react/16/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { MobileNavigationItems, NavigationItems } from "./navigation-items";
import NavigationMenuItem from "./navigation-menu-item";
import PlaybackInfo from "./spotify/playback-info";

const navigation = [
  { name: "Dashboard", href: "/", current: false },
  { name: "Albums", href: "/albums", current: false },
  { name: "Playlists", href: "/playlists", current: false },
];
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
  const navigationItems = [...navigation];
  const user = session?.user;

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div
        className="grid max-h-screen min-h-full"
        style={{ gridTemplateRows: "auto 1fr auto" }}
      >
        <Disclosure as="nav" className="bg-fuchsia-800 text-yellow-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="block h-8 w-auto lg:hidden"
                    width={32}
                    height={32}
                  />
                  <Image
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="hidden h-8 w-auto lg:block"
                    width={32}
                    height={32}
                  />
                </div>
                <NavigationItems navigationItems={navigationItems} />
              </div>
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
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <MobileNavigationItems navigationItems={navigationItems} />
            <div className="border-t border-yellow-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {!!user?.image && (
                    <Image
                      alt=""
                      src={user?.image}
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href ?? ""}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div className="overflow-auto bg-fuchsia-600 py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                {navigation.find((item) => item.current)?.name}
              </h1>
            </div>
          </header>
          <main className="">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        <footer className="">
          {session?.user && <PlaybackInfo />}{" "}
          {!user && <div className="text-3xl">fdsfdfsd</div>}
        </footer>
      </div>
    </>
  );
}
