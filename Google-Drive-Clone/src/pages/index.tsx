
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Index() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      router.replace("/drive/my-drive");
    } else {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  return null;
}
