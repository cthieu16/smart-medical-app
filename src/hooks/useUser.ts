import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: Address | null;
};

type PatientProfile = {
  address: string;
  age: number;
  chanelNumber: string;
  code: string;
  dateOfBirth: string;
  email: string;
  gender: number;
  id: string;
  name: string;
  userId: string;
};

type UpdatePatientProfileData = Partial<PatientProfile>;

type UpdateUserData = Partial<User>;

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const useUser = () => {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();  

  const updateUser = async (data: UpdateUserData, userId: string): Promise<User> => {
    const response = await fetch(`${ApiURL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update user data");
    }
    return response.json();
  };

  const updatePatientProfile = async (data: UpdatePatientProfileData): Promise<PatientProfile> => {
    const response = await fetch(`${ApiURL}/auth/update-profile-patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update patient profile");
    }
    return response.json();
  };

  const userMutation: UseMutationResult<User, Error, { data: UpdateUserData; userId: string }> = useMutation({
    mutationFn: ({ data, userId }) => updateUser(data, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  const patientProfileMutation: UseMutationResult<PatientProfile, Error, UpdatePatientProfileData> = useMutation({
    mutationFn: (data) => updatePatientProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["patientProfile"], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    user,
    updateUser: (data: UpdateUserData, userId: string) => userMutation.mutate({ data, userId }),
    isUpdatingUser: userMutation.isPending,
    updateUserError: userMutation.error,
    updatePatientProfile: (data: UpdatePatientProfileData) => 
      patientProfileMutation.mutate(data),
    isUpdatingPatientProfile: patientProfileMutation.isPending,
    updatePatientProfileError: patientProfileMutation.error,
  };
};
