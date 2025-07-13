import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { DoctorsApiResponse } from '../types/api';
import { DataFetchStatus } from '../types/global';

const useDoctorsData = () => {
  const { doctors, setDoctors } = useStore();
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctors.length === 0) {
        setStatus(DataFetchStatus.InProgress);
        try {
          const response = await fetch('/api/doctors');
          const data: DoctorsApiResponse = await response.json();
          
          if (data.success && data.data) {
            setDoctors(data.data);
            setStatus(DataFetchStatus.Success);
          } else {
            setStatus(DataFetchStatus.Error);
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setStatus(DataFetchStatus.Error);
        }
      } else {
        setStatus(DataFetchStatus.Success);
      }
    };

    fetchDoctors();
  }, [doctors.length, setDoctors]);

  return { doctors, status };
};

export default useDoctorsData;
