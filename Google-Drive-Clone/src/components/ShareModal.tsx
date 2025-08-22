import React, { useEffect, useState } from "react";
import {
  addPermission,
  listPermissions,
  removePermission,
  PermissionRole,
} from "@/API/permissions.supabase";

interface ShareModalProps {
  fileId: string;
  onClose: () => void;
}

export default function ShareModal({ fileId, onClose }: ShareModalProps) {
  // Debug: log when ShareModal is rendered and with what props
  console.log('ShareModal rendered with fileId:', fileId);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PermissionRole>("viewer");
  const [permissions, setPermissions] = useState<
    { email: string; role: PermissionRole }[]
  >([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const perms = await listPermissions(fileId);
    setPermissions(perms);
  };

  const handleAdd = async () => {
    if (!email) return;
    setSaving(true);
    try {
      await addPermission(fileId, email, role);
    } catch (err) {
      console.error('Error adding permission:', err);
      alert('Failed to add permission: ' + (err?.message || err));
    }
    setSaving(false);
    setEmail("");
    loadPermissions();
  };

  const handleRemove = async (userEmail: string) => {
    await removePermission(fileId, userEmail);
    loadPermissions();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-96 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Share File</h2>

        {/* Email Input */}
        <input
          type="email"
          name="share-email"
          id="share-email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border p-2"
        />

        {/* Role Selector */}
        <select
          name="share-role"
          id="share-role"
          value={role}
          onChange={(e) => setRole(e.target.value as PermissionRole)}
          className="mb-3 w-full rounded border p-2"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add"}
        </button>

        {/* Permissions List */}
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium">People with access</h3>
          {permissions.length === 0 && (
            <p className="text-xs text-gray-500">No one yet</p>
          )}
          {permissions.map((p) => (
            <div
              key={p.email}
              className="flex items-center justify-between border-b py-2 text-sm"
            >
              <span>
                {p.email} ({p.role})
              </span>
              <button
                onClick={() => handleRemove(p.email)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
