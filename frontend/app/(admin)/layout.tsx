"use client";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Sheet } from "@/components/ui/sheet";
import { useAuthStore } from "@/ZustandStore/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <Sheet>
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:ml-65 px-3">
        <Topbar />
        <main>{children}</main>
      </div>
    </Sheet>
  );
}
