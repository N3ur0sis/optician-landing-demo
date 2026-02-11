import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      permissions: Record<string, boolean> | null
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    permissions: Record<string, boolean> | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    permissions: Record<string, boolean> | null
  }
}
