import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User, { IUser } from '../../../models/User';
import { UserRole } from '../../../types/global';
import { DoctorsApiResponse, UserDTO } from '../../../types/api';

export async function GET(): Promise<NextResponse<DoctorsApiResponse>> {
  try {
    await connectDB();
    
    const doctors: IUser[] = await User.find({ role: UserRole.Doctor })
      .select('-password')
      .sort({ name: 1 });
    
    const responseData: UserDTO[] = doctors.map((doctor) => ({
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
      }));
    
    return NextResponse.json<DoctorsApiResponse>({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json<DoctorsApiResponse>(
      { 
        success: false, 
        error: 'Failed to fetch doctors' 
      },
      { status: 500 }
    );
  }
} 