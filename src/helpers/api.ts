import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export const USER_BRIEF_FIELDS_SELECTOR = 'name image role';

export const USER_FULL_FIELDS_SELECTOR = 'name image role email dateOfBirth phoneNumber country gender specializations description experience';

export const getSessionUserId = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
};

export const errorResponse = (status: number, message: string) => {
  return NextResponse.json({
    success: false, error: message },
    { status },
  );
};

export const unauthorizedResponse = () => {
  return errorResponse(401, 'Unauthorized');
};

export const noAccessResponse = () => {
  return errorResponse(403, 'Access denied');
}

export const notFoundResponse = (entity: string) => {
  return errorResponse(404, `${entity} not found`);
}