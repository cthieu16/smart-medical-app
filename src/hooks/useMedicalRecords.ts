import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type MedicalRecord = {
  id: string;
  patientName: string | null;
  patientId: string;
  code: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string;
  medicalHistory: string;
  examinationDate: string;
  testResults: string | null;
  createdAt: string;
  updatedAt: string;
};

const fetchMedicalRecords = async (
  accessToken: string
): Promise<MedicalRecord[]> => {
  const response = await fetch(`${ApiURL}/medical-records/my-records`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch medical records");
  }

  const jsonResponse = await response.json();
  return jsonResponse.data;
};

const fetchMedicalRecordDetail = async (
  accessToken: string,
  medicalRecordId: string
): Promise<MedicalRecord> => {
  const response = await fetch(`${ApiURL}/medical-records/${medicalRecordId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch medical record detail");
  }

  const jsonResponse = await response.json();
  return jsonResponse.data;
};

export const useMedicalRecords = () => {
  const { accessToken } = useAuth();

  return useQuery<MedicalRecord[], Error>({
    queryKey: ["medical-records"],
    queryFn: () => fetchMedicalRecords(accessToken as string),
    enabled: !!accessToken,
  });
};

export const useMedicalRecordDetail = (medicalRecordId: string) => {
  const { accessToken } = useAuth();

  return useQuery<MedicalRecord, Error>({
    queryKey: ["medical-record-detail", medicalRecordId],
    queryFn: () =>
      fetchMedicalRecordDetail(accessToken as string, medicalRecordId),
    enabled: !!accessToken && !!medicalRecordId,
  });
};
