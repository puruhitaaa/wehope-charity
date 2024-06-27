import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Roles } from "@/types/global";

export const renderName = (sessionClaims: CustomJwtSessionClaims) => {
  const { fullName, firstName, lastName, username } = sessionClaims;
  if (fullName) return fullName;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  if (username) return username;
  return "Unknown";
};

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const getUserAuth = async () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId, sessionClaims } = auth();
  if (userId) {
    return {
      session: {
        user: {
          id: userId,
          name: renderName(sessionClaims),
          email: sessionClaims?.email,
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};

export const checkAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
};

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();

  return sessionClaims?.metadata.role === role;
};
