import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Specialization, { ISpecialization } from '../../../models/Specialization';
import { SpecializationResponse } from '../../../types/global';

interface SpecializationsApiResponse {
  success: boolean;
  data?: SpecializationResponse[];
  error?: string;
}

export async function GET(): Promise<NextResponse<SpecializationsApiResponse>> {
  try {
    await connectDB();
    
    const specializations: ISpecialization[] = await Specialization.find({})
      .select('_id name description')
      .sort({ name: 1 });
    
    const responseData: SpecializationResponse[] = specializations.map((spec) => ({
      id: spec._id.toString(),
      name: spec.name,
      description: spec.description,
    }));
    
    return NextResponse.json<SpecializationsApiResponse>({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching specializations:', error);
    return NextResponse.json<SpecializationsApiResponse>(
      { 
        success: false, 
        error: 'Failed to fetch specializations' 
      },
      { status: 500 }
    );
  }
} 