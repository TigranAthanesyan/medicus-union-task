import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConsultationType } from "@/types";

interface BookingFormData {
  date: string;
  time: string;
  type: ConsultationType;
}

const useBooking = (doctorId: string) => {
  const router = useRouter();

  const [bookingData, setBookingData] = useState<BookingFormData>({
    date: "",
    time: "",
    type: ConsultationType.Video,
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string>("");

  const handleDateSelect = (date: string) => {
    setBookingData(prev => ({ ...prev, date, time: "" }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
  };

  const handleTypeChange = (type: ConsultationType) => {
    setBookingData(prev => ({ ...prev, type }));
  };

  const handleBookConsultation = async () => {
    if (!bookingData.date || !bookingData.time) {
      setBookingError("Please select a date and time");
      return;
    }

    setIsBooking(true);
    setBookingError("");

    try {
      const selectedDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);

      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId,
          dateTime: selectedDateTime.toISOString(),
          type: bookingData.type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/consultations/${data.data.id}?success=true`);
      } else {
        setBookingError(data.error || "Failed to book consultation");
      }
    } catch (error) {
      console.error("Error booking consultation:", error);
      setBookingError("Failed to book consultation");
    } finally {
      setIsBooking(false);
    }
  };

  return {
    bookingData,
    isBooking,
    bookingError,
    handleDateSelect,
    handleTimeSelect,
    handleTypeChange,
    handleBookConsultation,
  };
};

export default useBooking;
