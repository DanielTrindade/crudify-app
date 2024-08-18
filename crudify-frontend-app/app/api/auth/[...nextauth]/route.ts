import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:3000/auth/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        console.log('res => ', res);

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
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt', token, user)
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
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }