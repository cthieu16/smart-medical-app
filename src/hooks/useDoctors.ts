import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type Doctor = {
  id: string;
  fullName: string;
  code: string;
  userId: string;
  specialtyId: string;
  phone: string;
  address: string;
  chanelNumber: string;
  departmentId: string;
};

const fetchMyDoctors = async (accessToken: string): Promise<Doctor[]> => {
  const response = await fetch(`${ApiURL}/appointments/my-doctors`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  const jsonResponse = await response.json();
  return jsonResponse.data;
};

export const useMyDoctors = () => {
  const { accessToken } = useAuth();

  return useQuery<Doctor[], Error>({
    queryKey: ["my-doctors"],
    queryFn: () => fetchMyDoctors(accessToken as string),
    enabled: !!accessToken,
  });
};
