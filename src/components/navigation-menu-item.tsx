"use client";
import { MenuItem } from "@headlessui/react";
import { signOut } from "next-auth/react";

export default function NavigationMenuItem({
  item,
}: {
  item: { name: string; href?: string; onClick?: () => void };
}) {
  return (
    <MenuItem>
      <a
        href={item.href}
        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
        onClick={() => signOut()}
      >
        {item.name}
      </a>
    </MenuItem>
  );
}
