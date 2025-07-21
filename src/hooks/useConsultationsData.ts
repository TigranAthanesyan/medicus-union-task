import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ConsultationDTO, DataFetchStatus } from "@/types";

const useConsultationsData = () => {
    const { data: session } = useSession();

    const [consultations, setConsultations] = useState<ConsultationDTO[]>([]);
    const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);

    const fetchConsultations = useCallback(async () => {
      setStatus(DataFetchStatus.InProgress);
  
      try {
        const response = await fetch("/api/consultations");
        const data = await response.json();
  
        if (data.success) {
          setConsultations(data.data);
          setStatus(DataFetchStatus.Success);
        } else {
          setStatus(DataFetchStatus.Error);
        }
      } catch (error) {
        console.error("Error fetching consultations:", error);
        setStatus(DataFetchStatus.Error);
      }
    }, []);
  
    useEffect(() => {
      if (session) {
        fetchConsultations();
      }
    }, [fetchConsultations, session]);

    return { consultations, status };
};

export default useConsultationsData;
