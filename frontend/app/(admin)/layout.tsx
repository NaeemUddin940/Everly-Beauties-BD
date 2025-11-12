import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { Sheet } from "@/components/ui/sheet";
import { redirect } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { role: "admin" };
  if (user.role !== "admin") {
    redirect("/home");
  }

  return (
    <>
      <Sheet>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="lg:ml-65 px-3">
          {" "}
          {/* optional: space for sidebar */}
          <Topbar />
          <main>{children}</main>
        </div>
      </Sheet>
    </>
  );
}
