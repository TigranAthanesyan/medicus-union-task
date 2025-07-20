import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "../../../../../lib/mongodb";
import User, { IUser } from "../../../../../models/User";
import Consultation from "../../../../../models/Consultation";
import { 
  UserRole, 
  ConsultationStatus, 
  TimeSlot,
  DayAvailability,
  AvailabilityApiResponse
} from "../../../../../types";
import { errorResponse, notFoundResponse } from "@/helpers/api";
import { getDateString, getTimeString } from "@/utils/formatting";

const WORKING_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM (last appointment start time)
};

const DAYS_TO_SHOW = 14; // Show availability for next 2 weeks

export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
): Promise<NextResponse<AvailabilityApiResponse>> {
  try {
    await connectDB();

    const { doctorId } = await params;

    if (!Types.ObjectId.isValid(doctorId)) {
      return errorResponse(400, "Invalid doctor ID format");
    }

    const doctor: IUser | null = await User.findOne({
      _id: new Types.ObjectId(doctorId),
      role: UserRole.Doctor,
    }).select("name consultationDuration");

    if (!doctor) {
      return notFoundResponse("Doctor");
    }

    const consultationDuration = doctor.consultationDuration || 30;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + DAYS_TO_SHOW);

    const existingConsultations = await Consultation.find({
      doctorId: new Types.ObjectId(doctorId),
      dateTime: {
        $gte: startDate,
        $lt: endDate,
      },
      status: { $in: [ConsultationStatus.Pending, ConsultationStatus.Confirmed] },
    }).select("dateTime duration");

    // Map of booked time slots
    const bookedSlots = new Set<string>();
    existingConsultations.forEach((consultation) => {
      const consultationStart = new Date(consultation.dateTime);
      const consultationEnd = new Date(consultationStart.getTime() + consultation.duration * 60000);
      
      for (let time = consultationStart.getTime(); time < consultationEnd.getTime(); time += 30 * 60000) {
        const slotDate = new Date(time);
        const slotKey = `${getDateString(slotDate)}_${getTimeString(slotDate.getHours(), slotDate.getMinutes())}}`;
        bookedSlots.add(slotKey);
      }
    });

    const availability: DayAvailability[] = [];
    
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      if (currentDate.getTime() < new Date().setHours(0, 0, 0, 0) && i > 0) {
        continue;
      }

      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // sunday or saturday
        continue;
      }

      const dateStr = getDateString(currentDate);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

      const slots: TimeSlot[] = [];

      // Generate time slots for working hours
      for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotKey = `${dateStr}_${timeStr}`;
          
          const slotDateTime = new Date(currentDate);
          slotDateTime.setHours(hour, minute, 0, 0);
          
          const slotEndTime = new Date(slotDateTime.getTime() + consultationDuration * 60000);
          const workingEndTime = new Date(currentDate);
          workingEndTime.setHours(WORKING_HOURS.end, 0, 0, 0);

          if (slotEndTime > workingEndTime) {
            continue;
          }

          const now = new Date();
          if (currentDate.toDateString() === now.toDateString() && slotDateTime <= now) {
            continue;
          }

          const isAvailable = !bookedSlots.has(slotKey);

          slots.push({
            time: timeStr,
            available: isAvailable,
          });
        }
      }

      availability.push({
        date: dateStr,
        dayName,
        slots,
      });
    }

    return NextResponse.json<AvailabilityApiResponse>({
      success: true,
      data: availability,
    });

  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return errorResponse(500, "Failed to fetch availability");
  }
} 