import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "../../../../lib/mongodb";
import { userToUserDTO } from "../../../../utils/converters";
import User, { IUser } from "../../../../models/User";
import { UserRole, DoctorByIdApiResponse } from "../../../../types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<DoctorByIdApiResponse>> {
  try {
    await connectDB();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json<DoctorByIdApiResponse>(
        {
          success: false,
          error: "Invalid doctor ID format",
        },
        { status: 400 }
      );
    }

    const doctor: IUser | null = await User.findOne({
      _id: new Types.ObjectId(id),
      role: UserRole.Doctor,
    }).select("-password");

    if (!doctor) {
      return NextResponse.json<DoctorByIdApiResponse>(
        {
          success: false,
          error: "Doctor not found",
        },
        { status: 404 }
      );
    }

    const responseData = userToUserDTO(doctor);

    return NextResponse.json<DoctorByIdApiResponse>({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json<DoctorByIdApiResponse>(
      {
        success: false,
        error: "Failed to fetch doctor",
      },
      { status: 500 }
    );
  }
}
