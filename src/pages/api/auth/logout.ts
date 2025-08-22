import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  // To logout, clear the session cookie (handled by NextAuth by default)
  // You can also clear custom cookies here if you use them
  res.setHeader("Set-Cookie", [
    `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  ]);
  return res.status(200).json({ message: "Logged out" });
}
