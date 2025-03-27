import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  queueNumber: number;
  startTime: string;
  endTime: string;
  status: string;
  createAt: string;
  note: string;
};

export type CreateAppointmentData = {
  doctorId: string;
  startTime: string;
  endTime: string;
  note?: string;
};

export type UpdateAppointmentStatusData = {
  id: string;
  status: string;
  note?: string;
};

const fetcher = async (url: string, accessToken: string, options = {}) => {
  const response = await fetch(`${ApiURL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
};

const fetchMyAppointments = (
  accessToken: string
): Promise<{ data: Appointment[] }> =>
  fetcher("/appointments/my-appointments", accessToken);

const fetchAppointmentDetail = (
  accessToken: string,
  appointmentId: string
): Promise<{ data: Appointment }> =>
  fetcher(`/appointments/${appointmentId}`, accessToken);

const createAppointment = (
  accessToken: string,
  appointmentData: CreateAppointmentData
) =>
  fetcher("/appointments", accessToken, {
    method: "POST",
    body: JSON.stringify(appointmentData),
  });

const updateAppointmentStatus = (
  accessToken: string,
  updateData: UpdateAppointmentStatusData
) =>
  fetcher("/appointments/update-status", accessToken, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

export const useMyAppointments = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["my-appointments"],
    queryFn: () =>
      fetchMyAppointments(accessToken as string).then((res) => res.data),
    enabled: Boolean(accessToken),
  });
};

export const useAppointmentDetail = (appointmentId: string) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["appointment-detail", appointmentId],
    queryFn: () =>
      fetchAppointmentDetail(accessToken as string, appointmentId).then(
        (res) => res.data
      ),
    enabled: Boolean(accessToken && appointmentId),
  });
};

export const useCreateAppointment = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentData: CreateAppointmentData) =>
      createAppointment(accessToken as string, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create-appointments"] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateAppointmentStatusData) =>
      updateAppointmentStatus(accessToken as string, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
    },
  });
};
