"use client";

import React from "react";
import { useParams} from "next/navigation";
import useLoggedIn from "@/hooks/useLoggedIn";
import Consultation from "@/components/Consultation";

export default function ConsultationDetailsPage() {
  const params = useParams();
  useLoggedIn(`/consultations/${params.id}`);

  return <Consultation />
}
