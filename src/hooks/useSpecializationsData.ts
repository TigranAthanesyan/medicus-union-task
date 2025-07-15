import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { DataFetchStatus, SpecializationsApiResponse } from '../types';

const useSpecializationsData = () => {
  const { specializations, setSpecializations } = useStore();
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);

  useEffect(() => {
    const fetchSpecializations = async () => {
      if (specializations.length === 0) {
        setStatus(DataFetchStatus.InProgress);
        try {
          const response = await fetch('/api/specializations');
          const data: SpecializationsApiResponse = await response.json();
          
          if (data.success && data.data) {
            setSpecializations(data.data);
            setStatus(DataFetchStatus.Success);
          } else {
            setStatus(DataFetchStatus.Error);
          }
        } catch (error) {
          console.error('Error fetching specializations:', error);
          setStatus(DataFetchStatus.Error);
        }
      } else {
        setStatus(DataFetchStatus.Success);
      }
    };

    fetchSpecializations();
  }, [setSpecializations, specializations.length]);

  return { specializations, status };
};

export default useSpecializationsData; 