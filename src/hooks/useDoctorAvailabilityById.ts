import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DayAvailability, UserRole } from "@/types";

const useDoctorAvailabilityById = (id: string) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string>("");

  useEffect(() => {
    if (session && session.user.role !== UserRole.Patient) {
      router.push(`/doctors/${id}`);
    }
  }, [session, router, id]);

  const fetchAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    setAvailabilityError("");

    try {
      const response = await fetch(`/api/consultations/availability/${id}`);
      const data = await response.json();

      if (data.success) {
        setAvailability(data.data);
      } else {
        setAvailabilityError(data.error || "Failed to load availability");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailabilityError("Failed to load availability");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAvailability();
    }
  }, [fetchAvailability, id]);

  return { availability, availabilityLoading, availabilityError };
};

export default useDoctorAvailabilityById;