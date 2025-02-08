import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChange } from "../lib/firebase/auth";
import { CircularProgress, Box } from "@mui/material";
import { User } from "firebase/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const handleAuth = async () => {
      const unsubscribe = onAuthStateChange(async (user: User | null) => {
        if (!mounted) return;

        if (!user && router.pathname !== "/auth") {
          try {
            await router.push("/auth");
          } catch (error) {
            if (!(error instanceof Error && "cancelled" in error)) {
              console.error("Navigation error:", error);
            }
          }
        } else if (user && router.pathname === "/auth") {
          try {
            await router.push("/");
          } catch (error) {
            if (!(error instanceof Error && "cancelled" in error)) {
              console.error("Navigation error:", error);
            }
          }
        }

        if (mounted) {
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [router, router.pathname]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
