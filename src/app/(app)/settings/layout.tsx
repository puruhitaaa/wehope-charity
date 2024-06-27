import { redirect } from "next/navigation";
import { checkRole } from "../../../lib/auth/utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  return <main>{children}</main>;
}
