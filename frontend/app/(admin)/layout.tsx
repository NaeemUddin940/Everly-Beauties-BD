"use client";

import Sidebar from "@/components/admin/Sidebar";
import { Sheet } from "@/components/ui/sheet";
import { ThemeProvider } from "@/components/ui/theme-providet";
import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ⏳ Wait until auth check is done
  if (isCheckingAuth) {
    return <div className="text-center py-10">Checking authentication...</div>;
  }

  // 🚨 If authUser is still null (no user)
  if (!authUser) {
    return <div className="text-center py-10">User not found!</div>;
  }

  // 🧠 Now safe to check role
  if (authUser?.role !== "admin") {
    router.push("/");
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Sheet>
        <Toaster position="top-right" />
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="lg:ml-65 px-3">
          <main>{children}</main>
        </div>
      </Sheet>
    </ThemeProvider>
  );
}
