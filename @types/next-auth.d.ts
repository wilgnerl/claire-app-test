import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    token?: string
    user: {
      id: string
      username: string
      email: string
      role: string
      [key: string]: string
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string
    exp?: number
    iat?: number
    jti?: string
  }
}
