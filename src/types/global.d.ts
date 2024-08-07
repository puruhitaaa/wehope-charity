export {};

export type Roles = "admin" | "volunteer" | "user";

declare global {
  interface Window {
    snap: any;
  }
  interface CustomJwtSessionClaims {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    metadata: {
      role?: Roles;
    };
  }
}
