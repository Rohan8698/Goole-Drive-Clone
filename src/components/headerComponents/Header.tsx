"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import UserInfo from "./UserInfo";
import Link from "next/link";
import Search from "./Search";
import { FaUserCircle } from "react-icons/fa";

function Header() {
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { data: session } = useSession();

  if (session === null) {
    signIn();
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-6 shadow-sm">
      {/* Logo + Title */}
      <div className="flex items-center space-x-2">
        <Link href={"/"} className="flex items-center gap-2 group">
          <Image
  src="/logo.png"
  width={40}
  height={40}
  alt="QuantumDrive logo"
  className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
  draggable={false}
/>


          <h1 className="hidden text-xl font-semibold text-gray-800 tracking-wide tablet:block group-hover:text-indigo-600 transition-colors">
            QuantumDrive
          </h1>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 px-6">
        <Search />
      </div>

      {/* Profile Section */}
      <div
        onClick={() => {
          session ? setDisplayUserInfo((prev) => !prev) : signIn();
        }}
        className="ml-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gradient-to-br from-white to-gray-100 shadow hover:shadow-md transition-all"
      >
        {session ? (
          <Image
            src={session?.user.image as string}
            className="h-full w-full rounded-full object-cover"
            height={40}
            width={40}
            draggable={false}
            alt="avatar"
          />
        ) : (
          <FaUserCircle className="h-7 w-7 text-gray-500" />
        )}
      </div>

      {/* Dropdown (User Info) */}
      <div className="absolute right-6 top-16">
        {session && displayUserInfo && (
          <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
        )}
      </div>
    </header>
  );
}

export default Header;
