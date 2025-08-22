import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFileByPublicLink, incrementPublicLinkViews } from "@/API/Firestore";

export default function PublicFilePage() {
  const router = useRouter();
  const { token } = router.query;
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const fileData = await getFileByPublicLink(token as string);
      if (fileData) {
        // Check expiration
        if (fileData.public_link_expires && fileData.public_link_expires.toDate) {
          // Firestore Timestamp object
          if (fileData.public_link_expires.toDate() < new Date()) {
            setExpired(true);
            setLoading(false);
            return;
          }
        } else if (fileData.public_link_expires && new Date(fileData.public_link_expires) < new Date()) {
          setExpired(true);
          setLoading(false);
          return;
        }
        setFile(fileData);
        // Increment view count
        await incrementPublicLinkViews(fileData.id);
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (expired) return <div className="p-8 text-center">This public link has expired.</div>;
  if (!file) return <div className="p-8 text-center">File not found or link expired.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold mb-4">{file.fileName}</h1>
        <a
          href={file.fileLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mb-4 block"
        >
          Download/View File
        </a>
        <div className="text-gray-500 text-sm">Shared via public link</div>
        {file.public_link_views !== undefined && (
          <div className="text-xs text-gray-400 mt-2">Views: {file.public_link_views}</div>
        )}
        {file.public_link_expires && (
          <div className="text-xs text-gray-400 mt-1">
            Expires: {file.public_link_expires.toDate ? file.public_link_expires.toDate().toLocaleString() : new Date(file.public_link_expires).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
