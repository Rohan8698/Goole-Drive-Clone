import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { database } from "@/firebaseConfig";

const Filters = ({ setFilteredFiles }) => {
  const [type, setType] = useState("all");
  const [people, setPeople] = useState("all");
  const [modified, setModified] = useState("desc"); // desc = newest first

  useEffect(() => {
    const fetchFilteredFiles = async () => {
      let filesRef = collection(database, "files");
      let q = filesRef;

      // Filter by type
      if (type !== "all") {
        if (type === "folder") {
          q = query(q, where("isFolder", "==", true));
        } else {
          q = query(q, where("isFolder", "==", false));
        }
      }

      // Filter by people
      if (people !== "all") {
        q = query(q, where("userEmail", "==", people));
      }

      // Sorting by modified time (assuming you store createdAt or updatedAt in Firestore)
      q = query(q, orderBy("createdAt", modified));

      const snapshot = await getDocs(q);
      const filesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFilteredFiles(filesData);
    };

    fetchFilteredFiles();
  }, [type, people, modified, setFilteredFiles]);

  return (
    <div className="flex gap-4 rounded-lg bg-gray-100 p-3 shadow">
      {/* Type Filter */}
      <select
        className="rounded border p-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="folder">Folders</option>
        <option value="file">Files</option>
      </select>

      {/* People Filter */}
      <select
        className="rounded border p-2"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
      >
        <option value="all">All People</option>
        <option value="you@example.com">you@example.com</option>
        <option value="test@example.com">test@example.com</option>
      </select>

      {/* Modified Filter */}
      <select
        className="rounded border p-2"
        value={modified}
        onChange={(e) => setModified(e.target.value)}
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
};

export default Filters;
