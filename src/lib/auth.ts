import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import User, { IUser } from "../models/User";
import { UserRole } from "../types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          const user: IUser | null = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          const returnUser = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
            specializations: user.specializations,
            description: user.description,
            experience: user.experience,
          };

          return returnUser;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.image = user.image || undefined;
        token.dateOfBirth = user.dateOfBirth;
        token.phoneNumber = user.phoneNumber;
        token.specializations = user.specializations;
        token.description = user.description;
        token.experience = user.experience;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.image = token.image;
        session.user.dateOfBirth = token.dateOfBirth;
        session.user.phoneNumber = token.phoneNumber;
        session.user.specializations = token.specializations;
        session.user.description = token.description;
        session.user.experience = token.experience;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
