import Head from "next/head";
import GetFiles from "@/components/GetFiles";
import GetFolders from "@/components/GetFolders";
import FileHeader from "@/components/FileHeader";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchFiles } from "@/hooks/fetchFiles";
import { DotLoader } from "react-spinners";

export default function Home() {
  const [isFolder, setIsFolder] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<"all" | "file" | "folder">(
    "all",
  );
  const [peopleFilter, setPeopleFilter] = useState<string>("all");
  const [modifiedOrder, setModifiedOrder] = useState<"asc" | "desc">("desc");

  const { data: session } = useSession();

  // Fetch the list of files and folders
  const list = fetchFiles("", session?.user.email!);

  // Apply filters (people/type)
  const filtered = useMemo(() => {
    let items = list.filter((i) => !i.isTrashed);
    if (peopleFilter === "me") {
      items = items.filter((i) => i.userEmail === session?.user?.email);
    } else if (peopleFilter === "shared") {
      items = items.filter(
        (i: any) => Array.isArray(i.sharedWith) && i.sharedWith.length > 0,
      );
    }
    if (typeFilter === "file") items = items.filter((i) => !i.isFolder);
    if (typeFilter === "folder") items = items.filter((i) => i.isFolder);
    // Client-side sort fallback in case some docs lack timestamps
    items = items.sort((a: any, b: any) => {
      const aTime = a?.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
      const bTime = b?.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
      return modifiedOrder === "desc" ? bTime - aTime : aTime - bTime;
    });
    return items;
  }, [list, typeFilter, peopleFilter, modifiedOrder, session?.user?.email]);

  useEffect(() => {
    // Determine if there are folders and files in the list
    const hasFolders = filtered.some((item) => item.isFolder);
    const hasFiles = filtered.some((item) => !item.isFolder);

    // Update the state based on the results
    setIsFolder(hasFolders);
    setIsFile(hasFiles);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [filtered]);

  return (
    <>
      <Head>
        <title>QuantumDrive</title>
        <meta name="description" content="This is a google drive clone!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <FileHeader
          headerName={"My Space"}
          onChangeType={setTypeFilter}
          onChangePeople={setPeopleFilter}
          onChangeModified={setModifiedOrder}
          typeValue={typeFilter}
          peopleValue={peopleFilter}
          modifiedValue={modifiedOrder}
        />
        <div className="h-[75vh] w-full overflow-y-auto p-5">
          {/* If the list is loading, display the loading state */}
          {!isFile && !isFolder && isLoading ? (
            <div className="flex h-full items-center justify-center">
              <DotLoader color="#b8c2d7" size={60} />
            </div>
          ) : (
            <>
              {/* If there are files or folders, display them */}
              {isFile || isFolder ? (
                <>
                  {isFolder && (
                    // If there are folders, display them
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Folders</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFolders folderId="" select="" data={filtered} />
                      </div>
                    </div>
                  )}
                  {isFile && (
                    // If there are files, display them
                    <div className="mb-5 flex flex-col space-y-4">
                      <h2>Files</h2>
                      <div className="flex flex-wrap justify-start gap-x-3 gap-y-5 text-textC">
                        <GetFiles
                          folderId=""
                          select=""
                          modifiedOrder={modifiedOrder}
                          data={filtered}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // If there are no files or folders, display the empty state
                <div className="flex h-full flex-col items-center justify-center">
                  <h2 className="mb-5 text-xl font-medium text-textC">
                    A place for all of your files
                  </h2>
                  <Image
                    draggable={false}
                    src="/empty_state_drive.png"
                    width={500}
                    height={500}
                    alt="empty-state"
                    className="w-full max-w-2xl object-cover object-center"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
