import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { DiGoogleDrive } from "react-icons/di";
import { MdStarBorder } from "react-icons/md";
import { RiDeleteBin6Fill, RiDeleteBin6Line } from "react-icons/ri";
import { IoMdStar } from "react-icons/io";

function Navbar() {
  const router = useRouter();

  const isActive = (href: string) => router.pathname === href;

  const navItems = [
    {
      href: "/drive/my-drive",
      label: "My Space",
      icon: (active: boolean) =>
        active ? (
          <DiGoogleDrive className="h-6 w-6 rounded-sm border-2 border-blue-500 bg-blue-500 text-white tablet:h-5 tablet:w-5" />
        ) : (
          <DiGoogleDrive className="h-6 w-6 rounded-sm border-2 border-gray-400 tablet:h-5 tablet:w-5" />
        ),
    },
    {
      href: "/drive/starred",
      label: "Starred",
      icon: (active: boolean) =>
        active ? (
          <IoMdStar className="h-6 w-6 text-yellow-500 tablet:h-5 tablet:w-5" />
        ) : (
          <MdStarBorder className="h-6 w-6 text-gray-500 tablet:h-5 tablet:w-5" />
        ),
    },
    {
      href: "/drive/trash",
      label: "Bin",
      icon: (active: boolean) =>
        active ? (
          <RiDeleteBin6Fill className="h-6 w-6 text-red-500 tablet:h-5 tablet:w-5" />
        ) : (
          <RiDeleteBin6Line className="h-6 w-6 text-gray-500 tablet:h-5 tablet:w-5" />
        ),
    },
  ];

  return (
    <nav className="flex flex-col gap-1 pr-4">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-center rounded-xl p-2 transition-all duration-200 tablet:justify-start tablet:space-x-3 tablet:px-4 tablet:py-2 
            ${
              active
                ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon(active)}
            <span className="hidden tablet:block">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default Navbar;
