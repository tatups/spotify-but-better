"use client";
import { DisclosureButton } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface NavigationItemsProps {
  navigationItems: { name: string; href: string; current: boolean }[];
}

export function NavigationItems({ navigationItems }: NavigationItemsProps) {
  const currentPath = usePathname();
  const mappedNavigationItems = navigationItems.map((item) => ({
    ...item,
    current: item.href === currentPath,
  }));

  return (
    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
      {mappedNavigationItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={twMerge(
            item.current
              ? "border-indigo-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
          )}
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}

export function MobileNavigationItems({
  navigationItems,
}: NavigationItemsProps) {
  const currentPath = usePathname();
  const mappedNavigationItems = navigationItems.map((item) => ({
    ...item,
    current: item.href === currentPath,
  }));

  return (
    <div className="space-y-1 pb-3 pt-2">
      {navigationItems.map((item) => (
        <DisclosureButton
          key={item.name}
          as="a"
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={twMerge(
            item.current
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
            "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
          )}
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  );
}
