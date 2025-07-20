import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import { unauthorizedResponse, errorResponse, notFoundResponse } from "../../../helpers/api";
import { consultationToConsultationDTO, consultationToConsultationDTOWithUsers } from "../../../utils/converters";
import User, { IUser } from "../../../models/User";
import Consultation from "../../../models/Consultation";
import { 
  UserRole, 
  ConsultationStatus,
  CreateConsultationRequest,
  ConsultationsApiResponse,
  CreateConsultationApiResponse,
  PopulatedConsultation
} from "../../../types";

export async function GET(): Promise<NextResponse<ConsultationsApiResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    await connectDB();

    const query = session.user.role === UserRole.Doctor 
      ? { doctorId: new Types.ObjectId(session.user.id) }
      : { patientId: new Types.ObjectId(session.user.id) };

    const consultations: PopulatedConsultation[] = await Consultation.find(query)
      .populate({
        path: "doctorId",
        select: "name image",
        model: "User"
      })
      .populate({
        path: "patientId", 
        select: "name image",
        model: "User"
      })
      .sort({ dateTime: 1 });

    const consultationDTOs = consultations.map(consultationToConsultationDTO);

    return NextResponse.json<ConsultationsApiResponse>({
      success: true,
      data: consultationDTOs,
    });

  } catch (error) {
    console.error("Error fetching consultations:", error);
    return errorResponse(500, "Failed to fetch consultations");
  }
}

export async function POST(request: Request): Promise<NextResponse<CreateConsultationApiResponse>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    if (session.user.role !== UserRole.Patient) {
      return errorResponse(403, "Only patients can book consultations");
    }

    const body: CreateConsultationRequest = await request.json();
    const { doctorId, dateTime, type } = body;

    // Validate required fields
    if (!doctorId || !dateTime || !type) {
      return errorResponse(400, "Doctor ID, date/time, and consultation type are required");
    }

    if (!Types.ObjectId.isValid(doctorId)) {
      return errorResponse(400, "Invalid doctor ID format");
    }

    await connectDB();
    
    const doctor = await User.findOne({
      _id: new Types.ObjectId(doctorId),
      role: UserRole.Doctor,
    }).select("name image consultationDuration consultationPrice consultationCurrency");

    if (!doctor) {
      return notFoundResponse("Doctor");
    }

    const consultationDateTime = new Date(dateTime);

    if (consultationDateTime <= new Date()) {
      return errorResponse(400, "Cannot book consultations in the past");
    }

    const existingConsultation = await Consultation.findOne({
      doctorId: new Types.ObjectId(doctorId),
      dateTime: consultationDateTime,
      status: { $in: [ConsultationStatus.Pending, ConsultationStatus.Confirmed] },
    });

    if (existingConsultation) {
      return errorResponse(409, "This time slot is already booked");
    }

    const consultation = new Consultation({
      doctorId: new Types.ObjectId(doctorId),
      patientId: new Types.ObjectId(session.user.id),
      dateTime: consultationDateTime,
      duration: doctor.consultationDuration || 30,
      status: ConsultationStatus.Pending,
      type,
      price: doctor.consultationPrice || 0,
      currency: doctor.consultationCurrency || "USD",
    });

    await consultation.save();

    const patient: IUser = await User.findById(session.user.id).select("name image");

    const consultationDTO = consultationToConsultationDTOWithUsers(consultation, doctor, patient);

    return NextResponse.json<CreateConsultationApiResponse>(
      {
        success: true,
        data: consultationDTO,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating consultation:", error);
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return errorResponse(409, "This time slot is already booked");
    }
    return errorResponse(500, "Failed to create consultation");
  }
} 