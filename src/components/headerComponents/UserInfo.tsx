import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

type UserInfoProps = {
  setDisplayUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserInfo({ setDisplayUserInfo }: UserInfoProps) {
  const { data: session } = useSession();

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center
      space-y-3 rounded-2xl bg-darkC2 px-5 py-3 text-sm font-medium text-textC
      shadow-md shadow-[#b4bebb]"
    >
      {/* Close button */}
      <button
        aria-label="Close user info"
        title="Close"
        onClick={() => setDisplayUserInfo(false)}
        className="absolute right-3 top-3 rounded-full bg-darkC2 p-1 
                   transition-colors hover:bg-darkC"
      >
        <AiOutlineClose className="h-5 w-5 text-textC" />
      </button>

      {/* Email */}
      <p>{session?.user?.email}</p>

      {/* Avatar */}
      <div className="h-20 w-20 overflow-hidden rounded-full border">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt={`${session?.user?.name || "User"} avatar`}
            height={80}
            width={80}
            priority
            sizes="80px"
            className="h-full w-full rounded-full object-cover"
            draggable={false}
          />
        )}
      </div>

      {/* Greeting */}
      <h2 className="text-xl font-normal tablet:text-2xl">
        Hi, {session?.user?.name}!
      </h2>

      {/* Google account button */}
      <button
        className="rounded-full border border-black px-7 py-2 text-textC2 
                   transition-colors hover:bg-[#d3dfee]"
      >
        Manage your Google Account
      </button>

      {/* Add account / Sign out */}
      <div className="flex space-x-1">
        <button
          className="flex w-36 items-center space-x-2 rounded-l-full bg-white 
                     py-3 pl-3 transition-colors hover:bg-darkC tablet:w-44"
        >
          <HiOutlinePlus className="h-7 w-7 rounded-full bg-darkC2 p-1 text-textC2" />
          <span>Add account</span>
        </button>
        <button
          onClick={() => signOut()}
          className="flex w-36 items-center space-x-2 rounded-r-full bg-white 
                     py-3 pl-3 transition-colors hover:bg-darkC tablet:w-44"
        >
          <PiSignOutBold className="h-6 w-6" />
          <span>Sign out</span>
        </button>
      </div>

      {/* Footer links */}
      <div className="flex h-10 items-center space-x-2 text-xs">
        <span>Privacy policy</span>
        <span className="-mt-[3px]">·</span>
        <span>Terms of service</span>
      </div>
    </div>
  );
}

export default UserInfo;
