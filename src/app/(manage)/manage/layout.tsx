import { checkRole } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!checkRole("admin") && !checkRole("volunteer")) {
    redirect("/");
  }

  return <main>{children}</main>;
}
