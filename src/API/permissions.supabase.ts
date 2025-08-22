import { supabase } from "@/server/supabase";

export type PermissionRole = "viewer" | "editor";

// Add a permission (share a file)
export const addPermission = async (
  fileId: string,
  userEmail: string,
  role: PermissionRole
) => {
  const { error } = await supabase.from("file_permissions").insert([
    { file_id: fileId, email: userEmail, role }
  ]);
  if (error) throw error;
};

// Remove a permission
export const removePermission = async (fileId: string, userEmail: string) => {
  const { error } = await supabase
    .from("file_permissions")
    .delete()
    .eq("file_id", fileId)
    .eq("email", userEmail);
  if (error) throw error;
};

// List permissions for a file
export const listPermissions = async (fileId: string) => {
  const { data, error } = await supabase
    .from("file_permissions")
    .select("email, role")
    .eq("file_id", fileId);
  if (error) throw error;
  return data || [];
};
