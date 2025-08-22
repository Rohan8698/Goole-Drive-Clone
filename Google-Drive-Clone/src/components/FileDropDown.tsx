import React, { useState } from "react";
import { setPublicLink, revokePublicLink } from "@/API/Firestore";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdDriveFileRenameOutline,
  MdOutlineRestore,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import { deleteFile, renameFile, starFile, trashFile } from "@/API/Firestore";
import { useRouter } from "next/router";
import ShareModal from "./ShareModal"; // 👈 import the new Share modal

function FileDropDown({
  file,
  setOpenMenu,
  select,
  isFolderComp,
  folderId,
  setRenameToggle,
  onShare,
}: FileDropDownProps & { onShare?: (fileId: string) => void }) {

  const router = useRouter();
  const [publicLink, setPublicLinkState] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [linkExpiresIn, setLinkExpiresIn] = useState(24); // default 24 hours
  // Debug: log file object and file.id
  console.log('FileDropDown file:', file);
  const handleGetShareableLink = async () => {
    setGeneratingLink(true);
    // Generate a unique token
    const token = crypto.randomUUID();
    const result = await setPublicLink(file.id, token, linkExpiresIn);
    if (result.success) {
      setPublicLinkState(`${window.location.origin}/public/${token}`);
    } else {
      alert('Failed to generate public link');
    }
    setGeneratingLink(false);
  };

  const handleRevokeLink = async () => {
    if (!window.confirm('Are you sure you want to revoke the public link?')) return;
    const result = await revokePublicLink(file.id);
    if (result.success) {
      setPublicLinkState(null);
      alert('Public link revoked.');
    } else {
      alert('Failed to revoke public link');
    }
  };

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  return (
    <>
      <section
        onClick={() => setOpenMenu("")}
        className={`absolute top-9 z-10 ${
          select == "trashed" ? "h-fit" : "h-48"
        } w-48 overflow-y-scroll rounded-md border bg-white shadow-sm shadow-[#777]`}
      >
        {select !== "trashed" ? (
          <>
            <div
              onClick={() =>
                isFolderComp
                  ? router.push("/drive/folders/" + folderId)
                  : openFile(file.fileLink)
              }
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <HiOutlineArrowsExpand className="h-5 w-5" />
              <span className="text-sm">Open File</span>
            </div>

            {!isFolderComp && (
              <a
                href={file.fileLink}
                download={file.fileName}
                className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
              >
                <TbDownload className="h-5 w-5" />
                <span className="text-sm">Download</span>
              </a>
            )}

            <div
              onClick={() => setRenameToggle(file.id)}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdDriveFileRenameOutline className="h-5 w-5" />
              <span className="text-sm">Rename</span>
            </div>

            <div
              onClick={() => starFile(file.id, !file.isStarred)}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              {!file.isStarred ? (
                <MdStarBorder className="h-5 w-5" />
              ) : (
                <MdStarRate className="h-5 w-5" />
              )}
              <span className="text-sm">Add to starred</span>
            </div>

            {/* 👇 New Share option */}
            <div
              onClick={() => {
                console.log('Share option clicked, calling onShare');
                onShare && onShare(file.id);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <HiOutlineArrowsExpand className="h-5 w-5 rotate-45" />
              <span className="text-sm">Share</span>
            </div>

            {/* Get shareable link option */}
            <div className="my-2 px-3 py-1.5">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={linkExpiresIn}
                  onChange={e => setLinkExpiresIn(Number(e.target.value))}
                  className="w-16 rounded border p-1 text-xs"
                  title="Expiration (hours)"
                />
                <span className="text-xs">hours</span>
                <button
                  onClick={handleGetShareableLink}
                  disabled={generatingLink}
                  className="ml-2 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  {generatingLink ? 'Generating...' : 'Get shareable link'}
                </button>
              </div>
              {publicLink && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={publicLink}
                    readOnly
                    className="w-full rounded border p-1 text-xs"
                    onFocus={e => e.target.select()}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicLink);
                    }}
                    className="mt-1 w-full rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={handleRevokeLink}
                    className="mt-1 w-full rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Revoke Link
                  </button>
                </div>
              )}
            </div>

            <div
              onClick={() => trashFile(file.id, true)}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <RiDeleteBin6Line className="h-5 w-5" />
              <span className="text-sm">Move to bin</span>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => trashFile(file.id, false)}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdOutlineRestore className="h-5 w-5" />
              <span className="text-sm">Restore</span>
            </div>
            <div
              onClick={() => deleteFile(file.id, file.isFolder)}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <RiDeleteBin6Line className="h-5 w-5" />
              <span className="text-sm">Delete forever</span>
            </div>
          </>
        )}
      </section>

  {/* Share Modal removed; now handled by parent */}
    </>
  );
}

export default FileDropDown;
