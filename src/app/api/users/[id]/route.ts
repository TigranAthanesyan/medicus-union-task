import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "../../../../lib/mongodb";
import User, { IUser } from "../../../../models/User";
import { errorResponse, notFoundResponse } from "../../../../helpers/api";
import { userToUserDTO } from "../../../../utils/converters";
import { UserByIdApiResponse } from "../../../../types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<UserByIdApiResponse>> {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse(400, "Invalid user ID format");
    }

    const user: IUser | null = await User.findById(id).select("-password");

    if (!user) {
      return notFoundResponse("User");
    }

    const userDTO = userToUserDTO(user);

    return NextResponse.json({
      success: true,
      data: userDTO,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}
