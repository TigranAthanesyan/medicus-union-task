import clsx from "clsx";
import useBooking from "@/hooks/useBooking";
import useDoctorAvailabilityById from "@/hooks/useDoctorAvailabilityById";
import SectionWrapper from "@/components/SectionWrapper";
import { ConsultationType, DayAvailability, TimeSlot, UserDTO } from "@/types";
import styles from "./styles.module.css";

interface BookingFormProps {
  doctor: UserDTO;
}

export const BookingForm: React.FC<BookingFormProps> = ({ doctor }) => {
  const { availability, availabilityLoading, availabilityError } = useDoctorAvailabilityById(doctor.id);

  const {
    bookingData,
    isBooking,
    bookingError,
    handleDateSelect,
    handleTimeSelect,
    handleTypeChange,
    handleBookConsultation,
  } = useBooking(doctor.id);

  const getSelectedDayAvailability = (): DayAvailability | null => {
    return availability.find(day => day.date === bookingData.date) || null;
  };

  const getAvailableSlots = (): TimeSlot[] => {
    const selectedDay = getSelectedDayAvailability();
    return selectedDay ? selectedDay.slots.filter(slot => slot.available) : [];
  };

  const isSlotSelected = (time: string): boolean => {
    return bookingData.time === time;
  };

  const canBook = (): boolean => {
    return !!(bookingData.date && bookingData.time && !isBooking);
  };

  return (
    <SectionWrapper>
      <h2 className={styles.sectionTitle}>Book Your Consultation</h2>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Consultation Type</label>
        <div className={styles.typeOptions}>
          {Object.values(ConsultationType).map(type => (
            <button
              key={type}
              className={`${styles.typeOption} ${bookingData.type === type ? styles.typeOptionSelected : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              {type === ConsultationType.Video && "📹 Video Call"}
              {type === ConsultationType.Audio && "📞 Audio Call"} 
              {type === ConsultationType.Chat && "💬 Chat Only"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Date</label>

        {availabilityLoading ? (
          <div className={styles.loadingText}>Loading available dates...</div>
        ) : availabilityError ? (
          <div className={styles.errorText}>{availabilityError}</div>
        ) : (
          <div className={styles.dateGrid}>
            {availability.map(day => (
              <button
                key={day.date}
                className={clsx(styles.dateOption, bookingData.date === day.date && styles.dateOptionSelected)}
                onClick={() => handleDateSelect(day.date)}
                disabled={day.slots.filter(slot => slot.available).length === 0}
              >
                <div className={styles.dayName}>{day.dayName}</div>
                <div className={styles.dayDate}>
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className={styles.slotsCount}>
                  {day.slots.filter(slot => slot.available).length} slots
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {bookingData.date && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Select Time</label>
          <div className={styles.timeGrid}>
            {getAvailableSlots().map(slot => (
              <button
                key={slot.time}
                className={clsx(styles.timeSlot, isSlotSelected(slot.time) && styles.timeSlotSelected)}
                onClick={() => handleTimeSelect(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {bookingData.date && bookingData.time && (
        <div className={styles.bookingSummary}>
          <h3 className={styles.summaryTitle}>Booking Summary</h3>
          <div className={styles.summaryItem}>
            <span>Doctor:</span>
            <span>{doctor.name}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Date:</span>
            <span>{new Date(bookingData.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Time:</span>
            <span>{bookingData.time}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Duration:</span>
            <span>{doctor.consultationDuration || 30} minutes</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Type:</span>
            <span>{bookingData.type}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Price:</span>
            <span>{doctor.consultationCurrency || 'USD'} {doctor.consultationPrice || 0}</span>
          </div>
        </div>
      )}

      {bookingError && (
        <div className={styles.errorMessage}>
          {bookingError}
        </div>
      )}

      <button
        className={styles.bookButton}
        onClick={handleBookConsultation}
        disabled={!canBook()}
      >
        {isBooking ? "Booking..." : "Book Consultation"}
      </button>
    </SectionWrapper>
  );
};
