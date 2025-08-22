import { database } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const files = collection(database, "files");

// Add new file
export const addFiles = async (
  fileLink: string,
  fileName: string,
  folderId: string,
  userEmail: string,
) => {
  try {
    await addDoc(files, {
      fileLink,
      fileName,
      isFolder: false,
      isStarred: false,
      isTrashed: false,
      folderId,
      userEmail,
      sharedWith: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
  }
};

// Add new folder
export const addFolder = async (payload: any) => {
  try {
    await addDoc(files, {
      ...payload,
      sharedWith: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(err);
  }
};

// Rename file/folder
export const renameFile = async (
  fileId: string,
  newName: string,
  isFolder: boolean,
) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      [isFolder ? "folderName" : "fileName"]: newName,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating file properties:", error);
  }
};

// Star/unstar file
export const starFile = async (fileId: string, isStarred: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, { isStarred, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error updating file properties:", error);
  }
};

// Move file to trash
export const trashFile = async (fileId: string, isTrashed: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      isStarred: false,
      isTrashed,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating file properties:", error);
  }
};

// Delete file/folder
export const deleteFile = async (fileId: string, isFolder: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    await deleteDoc(fileRef);

    if (isFolder && fileId) {
      const filesQuery = query(files, where("folderId", "==", fileId));
      const querySnapshot = await getDocs(filesQuery);

      const deletePromises: any[] = [];
      querySnapshot.forEach((doc) => deletePromises.push(deleteDoc(doc.ref)));

      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error("Error deleting file or folder:", error);
  }
};

// Share file (append to sharedWith array)
export const shareFile = async (
  fileId: string,
  email: string,
  role: "viewer" | "editor",
) => {
  try {
    const fileRef = doc(files, fileId);

    await updateDoc(fileRef, {
      sharedWith: arrayUnion({
        email,
        role,
        createdAt: serverTimestamp(),
      }),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sharing file:", error);
    return { success: false, error };
  }
};

// List permissions (sharedWith) for a file
export const listPermissions = async (
  fileId: string,
): Promise<{ email: string; role: "viewer" | "editor" }[]> => {
  try {
    const fileRef = doc(files, fileId);
    const snap = await getDoc(fileRef);
    const data = snap.exists() ? (snap.data() as any) : {};
    return (
      (data.sharedWith as { email: string; role: "viewer" | "editor" }[]) || []
    );
  } catch (error) {
    console.error("Error listing permissions:", error);
    return [];
  }
};

// Remove a permission by email
export const removePermission = async (fileId: string, email: string) => {
  try {
    const fileRef = doc(files, fileId);
    const snap = await getDoc(fileRef);
    if (!snap.exists()) return;
    const data = snap.data() as any;
    const nextSharedWith = (data.sharedWith || []).filter(
      (p: any) => p?.email !== email,
    );
    await updateDoc(fileRef, {
      sharedWith: nextSharedWith,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing permission:", error);
  }
};

// Generate and set a public link for a file, with optional expiration (in hours)
export const setPublicLink = async (
  fileId: string,
  publicLink: string,
  expiresInHours?: number,
) => {
  const fileRef = doc(files, fileId);
  const expiresAt = expiresInHours
    ? new Date(Date.now() + expiresInHours * 3600 * 1000)
    : null;
  try {
    await updateDoc(fileRef, {
      public_link: publicLink,
      public_link_expires: expiresAt,
      public_link_views: 0,
      updatedAt: serverTimestamp(),
    });
    return { success: true, publicLink };
  } catch (error) {
    console.error("Error setting public link:", error);
    return { success: false, error };
  }
};

// Revoke public link
export const revokePublicLink = async (fileId: string) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      public_link: null,
      public_link_expires: null,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error revoking public link:", error);
    return { success: false, error };
  }
};

// Increment public link views
export const incrementPublicLinkViews = async (fileId: string) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      public_link_views:
        ((await getDoc(fileRef)).data()?.public_link_views || 0) + 1,
    });
  } catch (error) {
    console.error("Error incrementing public link views:", error);
  }
};

// Get file by public link (✅ fixed)
export const getFileByPublicLink = async (publicLink: string) => {
  try {
    const filesQuery = query(files, where("public_link", "==", publicLink));
    const querySnapshot = await getDocs(filesQuery);

    if (!querySnapshot.empty && querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0]!.data();
    }

    return null;
  } catch (error) {
    console.error("Error fetching file by public link:", error);
    return null;
  }
};
