"use client";

import React from "react";
import { useParams } from "next/navigation";
import useLoggedIn from "@/hooks/useLoggedIn";
import BookConsultation from "@/components/BookConsultation";

export default function BookConsultationPage() {
  const params = useParams();
  const doctorId = params.id as string;

  useLoggedIn(`/doctors/${doctorId}/book`);
  
  return <BookConsultation doctorId={doctorId} />;
}
