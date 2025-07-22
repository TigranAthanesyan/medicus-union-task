"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import useLoggedIn from "@/hooks/useLoggedIn";
import Consultation from "@/components/Consultation";

export default function ConsultationDetailsPage() {
  const params = useParams();
  const consultationId = params.id as string;

  useLoggedIn(`/consultations/${consultationId}`);

  const searchParams = useSearchParams();
  const isJustBooked = searchParams?.get("success") === "true";

  return <Consultation consultationId={consultationId} isJustBooked={isJustBooked} />
}
