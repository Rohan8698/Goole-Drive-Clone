import { useRouter } from "next/router";
import React from "react";

type FileHeaderProps = {
  headerName: string;
  onChangeType?: (value: "all" | "folder" | "file") => void;
  onChangePeople?: (value: string) => void;
  onChangeModified?: (value: "asc" | "desc") => void;
  typeValue?: "all" | "folder" | "file";
  peopleValue?: string;
  modifiedValue?: "asc" | "desc";
};

function FileHeader({
  headerName,
  onChangeType,
  onChangePeople,
  onChangeModified,
  typeValue = "all",
  peopleValue = "all",
  modifiedValue = "desc",
}: FileHeaderProps) {
  const router = useRouter();
  const isNestedFolder = router.route === "/drive/[...Folder]";

  return (
    <div className="flex flex-col space-y-6 p-5 pb-2">
      <div className="flex items-center space-x-2 text-2xl text-textC">
        {isNestedFolder && (
          <button aria-label="Go back" title="Back">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <span onClick={() => router.back()}>
              {/* back icon removed to keep dependency minimal in this edit */}←
            </span>
          </button>
        )}
        <h2>{headerName}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Type */}
        <select
          className="rounded-lg border border-textC px-4 py-1 text-sm font-medium"
          value={typeValue}
          onChange={(e) => onChangeType?.(e.target.value as any)}
        >
          <option value="all">Type</option>
          <option value="file">Files</option>
          <option value="folder">Folders</option>
        </select>
        {/* People */}
        <select
          className="rounded-lg border border-textC px-4 py-1 text-sm font-medium"
          value={peopleValue}
          onChange={(e) => onChangePeople?.(e.target.value)}
        >
          <option value="all">People</option>
          <option value="me">Owned by me</option>
          <option value="shared">Shared with others</option>
        </select>
        {/* Modified */}
        <select
          className="rounded-lg border border-textC px-4 py-1 text-sm font-medium"
          value={modifiedValue}
          onChange={(e) => onChangeModified?.(e.target.value as any)}
        >
          <option value="desc">Modified: Newest</option>
          <option value="asc">Modified: Oldest</option>
        </select>
      </div>
    </div>
  );
}

export default FileHeader;
