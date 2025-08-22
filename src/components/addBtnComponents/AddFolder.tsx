import React from "react";

function AddFolder({
  setFolderToggle,
  setFolderName,
  uploadFolder,
}: folderToggleProps) {
  const addFolder = () => {
    uploadFolder();
    setFolderToggle(false);
  };

  return (
    // Background overlay
    <div
      onClick={() => setFolderToggle(false)}
      className="absolute inset-0 z-20 flex h-screen w-screen items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      {/* Pop-up card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-96 transform rounded-2xl bg-white/80 p-6 shadow-xl shadow-gray-400 transition-all duration-300 ease-in-out hover:scale-[1.01]"
      >
        <h2 className="text-xl font-semibold text-gray-800">📂 Create New Folder</h2>
        
        <input
          className="mt-4 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-4 text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none"
          type="text"
          placeholder="Untitled folder"
          onChange={(e) => setFolderName(e.target.value)}
        />

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setFolderToggle(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addFolder}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFolder;
