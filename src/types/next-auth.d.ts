import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "STUDENT" | "ADMIN";
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "STUDENT" | "ADMIN";
      name?: string | null;
      email?: string | null;
    };
  }

  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      role: "STUDENT" | "ADMIN";
    }
  }
}
