import Header from "@/components/Header";
import { getUserAuth } from "@/lib/auth/utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getUserAuth();

  return (
    <>
      <Header session={session} />
      {children}
    </>
  );
}
