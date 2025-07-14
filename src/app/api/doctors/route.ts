import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User, { IUser } from '../../../models/User';
import { UserRole } from '../../../types/global';
import { DoctorsApiResponse, DoctorCardDTO } from '../../../types/api';

export async function GET(): Promise<NextResponse<DoctorsApiResponse>> {
  try {
    await connectDB();
    
    const doctors: IUser[] = await User.find({ role: UserRole.Doctor })
      .select('_id name image country specializations')
      .sort({ name: 1 });
    
    const responseData: DoctorCardDTO[] = doctors.map((doctor) => ({
        id: doctor._id.toString(),
        name: doctor.name,
        image: doctor.image,
        country: doctor.country,
        specializations: doctor.specializations || [],
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