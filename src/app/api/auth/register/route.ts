import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { UserRole, CreateUserInput, UserResponse } from "../../../../types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      role,
      image,
      dateOfBirth,
      phoneNumber,
      country,
      gender,
      specializations,
      description,
      experience,
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const userRole = role === UserRole.Doctor ? UserRole.Doctor : UserRole.Patient;
    if (userRole === UserRole.Doctor && (!specializations || !description)) {
      return NextResponse.json(
        { error: "Specializations and description are required for doctors" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: CreateUserInput = {
      email,
      password: hashedPassword,
      name,
      role: userRole,
    };

    if (image) {
      userData.image = image;
    }
    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }
    if (phoneNumber) {
      userData.phoneNumber = phoneNumber;
    }
    if (country) {
      userData.country = country;
    }
    if (gender) {
      userData.gender = gender;
    }
    if (userRole === UserRole.Doctor) {
      userData.specializations = specializations;
      userData.description = description;
      if (experience !== undefined && experience > 0) {
        userData.experience = experience;
      }
    }

    const user = new User(userData);
    await user.save();

    const responseUser: UserResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.image) {
      responseUser.image = user.image;
    }
    if (user.dateOfBirth) {
      responseUser.dateOfBirth = user.dateOfBirth;
    }
    if (user.phoneNumber) {
      responseUser.phoneNumber = user.phoneNumber;
    }
    if (user.country) {
      responseUser.country = user.country;
    }
    if (user.gender) {
      responseUser.gender = user.gender;
    }
    if (userRole === UserRole.Doctor) {
      responseUser.specializations = user.specializations;
      responseUser.description = user.description;
      if (user.experience) {
        responseUser.experience = user.experience;
      }
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: responseUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
