"use client";

import React from "react";
import { useParams } from "next/navigation";
import Specialization from "@/components/Specialization";

export default function SpecializationPage() {
  const params = useParams();
  const specializationKey = params.key as string;

  return <Specialization specializationKey={specializationKey} />;
}
