import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },

  secret: process.env.JWT_TOKEN,
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const token = jwt.sign(user.id, process.env.JWT_TOKEN as string)

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id + '',
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken: token,
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token })
      session.token = token.accessToken
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      }
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          ...u,
        }
      }
      return { ...token, user }
    },
  },
}

export default NextAuth(authOptions)
