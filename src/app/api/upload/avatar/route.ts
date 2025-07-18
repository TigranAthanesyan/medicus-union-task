import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import { AVATAR_MAX_SIZE, AVATAR_MAX_SIZE_DISPLAY } from "@/constants/global";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    if (file.size > AVATAR_MAX_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than ${AVATAR_MAX_SIZE_DISPLAY}` },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(file);

    return NextResponse.json({
      success: true,
      image: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
