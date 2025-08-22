import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabase } from "@/server/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const { data: user } = await supabase
    .from("users")
    .select("id, email, name, password")
    .eq("email", email)
    .single();
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Optionally, create a JWT here and set as cookie
  // For demo, just return success
  return res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, name: user.name } });
}
