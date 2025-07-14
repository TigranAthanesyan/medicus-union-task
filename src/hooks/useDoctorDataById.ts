import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import useSpecializationsData from './useSpecializationsData';
import { DoctorByIdApiResponse, UserDTO } from '../types/api';
import { DataFetchStatus } from '../types/global';

const useDoctorDataById = (id: string) => {
  const { doctorMapById, setDoctor } = useStore();
  const { specializations } = useSpecializationsData();
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const [rawDoctorData, setRawDoctorData] = useState<UserDTO | null>(null);

  const doctor = useMemo(() => {
    return doctorMapById[id];
  }, [id, doctorMapById]);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (doctor) {
        setStatus(DataFetchStatus.Success);
        return;
      }

      setStatus(DataFetchStatus.InProgress);
      try {
        const response = await fetch(`/api/doctors/${id}`);
        const data: DoctorByIdApiResponse = await response.json();
        
        if (data.success && data.data) {
          setRawDoctorData(data.data);
        } else {
          setStatus(DataFetchStatus.Error);
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setStatus(DataFetchStatus.Error);
      }
    };

    fetchDoctor();
  }, [id, doctor]);

  useEffect(() => {
    if (!rawDoctorData || status === DataFetchStatus.Error) {
      return;
    }

    if (!specializations.length) {
      setDoctor(rawDoctorData);
      setStatus(DataFetchStatus.Success);
      return;
    }

    const doctorWithSpecData = {
      ...rawDoctorData,
      specializationsDisplayData: rawDoctorData.specializations?.map(spec => ({
        key: spec,
        name: specializations.find(s => s.key === spec)?.name || spec,
      })),
    };

    setDoctor(doctorWithSpecData);
    setStatus(DataFetchStatus.Success);
    setRawDoctorData(null);
  }, [rawDoctorData, specializations, setDoctor, status]);

  return { doctor, status };
};

export default useDoctorDataById;
