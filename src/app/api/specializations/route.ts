import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Specialization, { ISpecialization } from "../../../models/Specialization";
import { SpecializationDTO, SpecializationsApiResponse } from "../../../types";

export async function GET(): Promise<NextResponse<SpecializationsApiResponse>> {
  try {
    await connectDB();

    const specializations: ISpecialization[] = await Specialization.find({})
      .select("key name description")
      .sort({ name: 1 });

    const responseData: SpecializationDTO[] = specializations.map((spec) => ({
      key: spec.key,
      name: spec.name,
      description: spec.description,
    }));

    return NextResponse.json<SpecializationsApiResponse>({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching specializations:", error);
    return NextResponse.json<SpecializationsApiResponse>(
      {
        success: false,
        error: "Failed to fetch specializations",
      },
      { status: 500 }
    );
  }
}
