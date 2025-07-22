import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      dateOfBirth?: Date;
      phoneNumber?: string;
      specializations?: string[];
      description?: string;
      experience?: number;
      consultationPrice?: number;
      consultationCurrency?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    dateOfBirth?: Date;
    phoneNumber?: string;
    specializations?: string[];
    description?: string;
    experience?: number;
    consultationPrice?: number;
    consultationCurrency?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: UserRole;
    image?: string;
    dateOfBirth?: Date;
    phoneNumber?: string;
    specializations?: string[];
    description?: string;
    experience?: number;
    consultationPrice?: number;
    consultationCurrency?: string;
  }
}
