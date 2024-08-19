import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:3000/auth/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })

        const user = await res.json()

        if (res.ok && user && user.accessToken) {
          return {
            id: user.userId,
            email: credentials.email,
            accessToken: user.accessToken,
            userId: user.userId
          }
        }
        return null
      }
    }),
    CredentialsProvider({
      id: 'signup',
      name: 'Signup',
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.name || !credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:3000/users", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        
        const user = await res.json()

        if (res.ok && user) {
          const loginRes = await fetch("http://localhost:3000/auth/login", {
            method: 'POST',
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            headers: { "Content-Type": "application/json" }
          })

          const loginUser = await loginRes.json()

          if (loginRes.ok && loginUser && loginUser.accessToken) {
            return {
              id: loginUser.userId,
              email: credentials.email,
              accessToken: loginUser.accessToken,
              userId: loginUser.userId
            }
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userId = token.userId;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }