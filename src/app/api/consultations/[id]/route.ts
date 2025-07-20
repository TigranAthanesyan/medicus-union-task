import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import Consultation from "../../../../models/Consultation";
import { 
  UserRole, 
  ConsultationStatus,
  UpdateConsultationRequest,
  ConsultationApiResponse,
} from "../../../../types";
import { getSessionUserId, unauthorizedResponse, errorResponse, notFoundResponse, noAccessResponse } from "../../../../helpers/api";
import { consultationToConsultationDTOWithUsers } from "../../../../utils/converters";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<ConsultationApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse(400, "Invalid consultation ID format");
    }

    await connectDB();

    const consultation = await Consultation.findById(id)
      .populate({
        path: "doctorId",
        select: "name image",
        model: "User"
      })
      .populate({
        path: "patientId",
        select: "name image", 
        model: "User"
      });

    if (!consultation) {
      return notFoundResponse("Consultation");
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasAccess = consultation.doctorId._id.equals(userObjectId) || consultation.patientId._id.equals(userObjectId);

    if (!hasAccess) {
      return noAccessResponse();
    }

    const consultationDTO = consultationToConsultationDTOWithUsers(
      consultation,
      consultation.doctorId,
      consultation.patientId,
      consultation.doctorId._id.equals(userObjectId),
    );

    return NextResponse.json<ConsultationApiResponse>({
      success: true,
      data: consultationDTO,
    });

  } catch (error) {
    console.error("Error fetching consultation:", error);
    return errorResponse(500, "Failed to fetch consultation");
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<ConsultationApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body: UpdateConsultationRequest = await request.json();
    const { status, notes } = body;

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse(400, "Invalid consultation ID format");
    }

    if (status && !Object.values(ConsultationStatus).includes(status)) {
      return errorResponse(400, "Invalid consultation status");
    }

    await connectDB();

    const user = await User.findById(userId).select("role");
    if (!user) {
      return notFoundResponse("User");
    }

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return notFoundResponse("Consultation");
    }

    const userObjectId = new Types.ObjectId(userId);
    const isDoctor = consultation.doctorId.equals(userObjectId) && user.role === UserRole.Doctor;
    const isPatient = consultation.patientId.equals(userObjectId) && user.role === UserRole.Patient;

    if (!isDoctor && !isPatient) {
      return noAccessResponse();
    }

    if (status) {
      if (isPatient) {
        if (status !== ConsultationStatus.Cancelled) {
          return errorResponse(400, "Patients can only cancel consultations");
        }
      } else if (isDoctor) {
        const allowedStatuses = [
          ConsultationStatus.Confirmed,
          ConsultationStatus.Declined,
          ConsultationStatus.Completed
        ];
        if (!allowedStatuses.includes(status)) {
          return errorResponse(400, "Invalid status change for doctor");
        }

        if ((status === ConsultationStatus.Confirmed || status === ConsultationStatus.Declined) 
            && consultation.status !== ConsultationStatus.Pending) {
          return errorResponse(400, "Only pending consultations can be approved or declined");
        }
      }
    }

    if (notes !== undefined && !isDoctor) {
      return errorResponse(403, "Only doctors can add notes");
    }

    const updateData: { status?: ConsultationStatus; notes?: string } = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    .populate({
      path: "doctorId",
      select: "name image",
      model: "User"
    })
    .populate({
      path: "patientId",
      select: "name image",
      model: "User"
    });

    const consultationDTO = consultationToConsultationDTOWithUsers(
      updatedConsultation!,
      updatedConsultation!.doctorId,
      updatedConsultation!.patientId,
      isDoctor,
    );

    return NextResponse.json<ConsultationApiResponse>({
      success: true,
      data: consultationDTO,
    });

  } catch (error) {
    console.error("Error updating consultation:", error);
    return errorResponse(500, "Failed to update consultation");
  }
}
