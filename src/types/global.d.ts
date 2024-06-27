export {};

export type Roles = "admin" | "volunteer" | "user";

declare global {
  interface CustomJwtSessionClaims {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    email?: string;
    metadata: {
      role?: Roles;
    };
  }
}
