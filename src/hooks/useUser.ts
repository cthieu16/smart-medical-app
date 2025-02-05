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

type UpdateUserData = Partial<User>;

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const useUser = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const updateUser = async (data: UpdateUserData): Promise<User> => {
    const response = await fetch(`${ApiURL}/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update user data");
    }
    return response.json();
  };

  const mutation: UseMutationResult<User, Error, UpdateUserData> = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  return {
    user,
    updateUser: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
