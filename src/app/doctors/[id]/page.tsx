"use client";

import { useParams } from "next/navigation";
import DoctorProfile from "@/components/DoctorProfile";

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id as string;

  return <DoctorProfile doctorId={doctorId} />;
}
