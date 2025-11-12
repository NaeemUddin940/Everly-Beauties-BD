import { redirect } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { role: "user" };
  if (!user || user.role !== "admin") {
    redirect("/home");
  }

  return { children };
}
