import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataFetchStatus, ConsultationDTO, ConsultationApiResponse, UpdateConsultationRequest, UserRole } from "@/types";

const useConsultationData = (id: string) => {
  const { data: session } = useSession();

  const [consultation, setConsultation] = useState<ConsultationDTO | null>(null);
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const [updateStatus, setUpdateStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const [notes, setNotes] = useState<string>("");
  const [saveNotesEnabled, setSaveNotesEnabled] = useState<boolean>(false);

  const fetchConsultation = useCallback(async () => {
    setStatus(DataFetchStatus.InProgress);

    try {
      const response = await fetch(`/api/consultations/${id}`);
      const data: ConsultationApiResponse = await response.json();

      if (data.success) {
        setConsultation(data.data || null);
        if (session?.user.role === UserRole.Doctor) {
          setNotes(data.data?.notes || "");
        }
        setStatus(DataFetchStatus.Success);
      } else {
        setStatus(DataFetchStatus.Error);
      }
    } catch (error) {
      console.error("Error fetching consultation:", error);
      setStatus(DataFetchStatus.Error);
    }
  }, [id, session?.user.role]);

  const updateConsultation = useCallback(async (updateRequest: UpdateConsultationRequest) => {
    if (!consultation) return;

    setUpdateStatus(DataFetchStatus.InProgress);

    try {
      const response = await fetch(`/api/consultations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequest),
      });

      const data: ConsultationApiResponse = await response.json();

      if (data.success) {
        setConsultation(data.data || null);
        setUpdateStatus(DataFetchStatus.Success);
      } else {
        setUpdateStatus(DataFetchStatus.Error);
      }
    } catch (error) {
      console.error("Error updating consultation:", error);
      setUpdateStatus(DataFetchStatus.Error);
    }
  }, [consultation, id]);

  useEffect(() => {
    if (session) {
      fetchConsultation();
    }
  }, [fetchConsultation, session]);

  useEffect(() => {
    if (session?.user.role !== UserRole.Doctor) return;

    setSaveNotesEnabled(notes !== consultation?.notes);
  }, [consultation?.notes, notes, session?.user.role]);

  return { consultation, status, updateStatus, fetchConsultation, updateConsultation, saveNotesEnabled, setNotes, notes };
}

export default useConsultationData;
