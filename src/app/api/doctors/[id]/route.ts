import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import connectDB from '../../../../lib/mongodb';
import User, { IUser } from '../../../../models/User';
import { UserRole } from '../../../../types/global';
import { DoctorByIdApiResponse, UserDTO } from '../../../../types/api';

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
          error: 'Invalid doctor ID format' 
        },
        { status: 400 }
      );
    }
    
    const doctor: IUser | null = await User.findOne({ 
      _id: new Types.ObjectId(id),
      role: UserRole.Doctor 
    }).select('-password');
    
    if (!doctor) {
      return NextResponse.json<DoctorByIdApiResponse>(
        { 
          success: false, 
          error: 'Doctor not found' 
        },
        { status: 404 }
      );
    }
    
    const responseData: UserDTO = {
      id: doctor._id.toString(),
      email: doctor.email,
      name: doctor.name,
      role: doctor.role,
      image: doctor.image,
      dateOfBirth: doctor.dateOfBirth,
      phoneNumber: doctor.phoneNumber,
      country: doctor.country,
      gender: doctor.gender,
      specializations: doctor.specializations,
      description: doctor.description,
      experience: doctor.experience,
    };
    
    return NextResponse.json<DoctorByIdApiResponse>({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json<DoctorByIdApiResponse>(
      { 
        success: false, 
        error: 'Failed to fetch doctor' 
      },
      { status: 500 }
    );
  }
} 