import {
  shareFile,
  removePermission as removePermFromFile,
  listPermissions as listPerms,
} from "./Firestore";

export type PermissionRole = "viewer" | "editor";

export const addPermission = async (
  fileId: string,
  userEmail: string,
  role: PermissionRole,
) => {
  await shareFile(fileId, userEmail, role);
};

export const removePermission = async (fileId: string, userEmail: string) => {
  await removePermFromFile(fileId, userEmail);
};

export const listPermissions = async (fileId: string) => {
  return await listPerms(fileId);
};
