import UserSettings from "@/components/UserSettings";
import { getUserAuth } from "@/lib/auth/utils";

export default async function Account() {
  const { session } = await getUserAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold my-4">Account</h1>
      <div className="space-y-4">
        <UserSettings session={session} />
      </div>
    </div>
  );
}
