import { useEffect, useState } from "react";
import { useStore } from "../store";
import useSpecializationsData from "./useSpecializationsData";
import { DataFetchStatus, DoctorCardDTO, DoctorsApiResponse } from "../types";

const useDoctorsData = () => {
  const { doctors, setDoctors } = useStore();
  const { specializations } = useSpecializationsData();
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const [rawDoctorsData, setRawDoctorsData] = useState<DoctorCardDTO[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctors.length > 0) {
        setStatus(DataFetchStatus.Success);
        return;
      }

      setStatus(DataFetchStatus.InProgress);
      try {
        const response = await fetch("/api/doctors");
        const data: DoctorsApiResponse = await response.json();

        if (data.success && data.data) {
          setRawDoctorsData(data.data);
        } else {
          setStatus(DataFetchStatus.Error);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setStatus(DataFetchStatus.Error);
      }
    };

    fetchDoctors();
  }, [doctors.length]);

  useEffect(() => {
    if (!rawDoctorsData.length || status === DataFetchStatus.Error) {
      return;
    }

    if (!specializations.length) {
      setDoctors(rawDoctorsData);
      setStatus(DataFetchStatus.Success);
      return;
    }

    const doctorsWithSpecializations = rawDoctorsData.map((doctor) => ({
      ...doctor,
      specializationsDisplayData: doctor.specializations.map((specialization) => ({
        key: specialization,
        name: specializations.find((s) => s.key === specialization)?.name || specialization,
      })),
    }));

    setDoctors(doctorsWithSpecializations);
    setStatus(DataFetchStatus.Success);
    setRawDoctorsData([]);
  }, [rawDoctorsData, specializations, setDoctors, status]);

  return { doctors, status };
};

export default useDoctorsData;
