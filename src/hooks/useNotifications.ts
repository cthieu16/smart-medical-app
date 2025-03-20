import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type Notification = {
  id: string;
  title: string;
  message: string;
  isReaded: boolean;
  notificationType: string;
  patientId: string;
  doctorId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
};

const fetchNotifications = async (
  accessToken: string
): Promise<Notification[]> => {
  const response = await fetch(`${ApiURL}/notifications/my-notifications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const jsonResponse = await response.json();
  return jsonResponse.data;
};

export const useNotifications = () => {
  const { accessToken } = useAuth();

  return useQuery<Notification[], Error>({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(accessToken as string),
    enabled: !!accessToken,
  });
};
