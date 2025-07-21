"use client";

import Consultations from "@/components/Consultations";
import useLoggedIn from "@/hooks/useLoggedIn";

export default function ConsultationsPage() {
  useLoggedIn(`/consultations`);

  return <Consultations />;
}
