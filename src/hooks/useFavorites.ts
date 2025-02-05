import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductInfo } from "./useProducts";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const getToken = async () => {
    const token = await AsyncStorage.getItem("@token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  const fetchFavorites = async (): Promise<ProductInfo[]> => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    return response.json();
  };

  const addFavorite = async (productId: string): Promise<void> => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }
  };

  const removeFavorite = async (productId: string): Promise<void> => {
    const token = await getToken();
    const response = await fetch(`${ApiURL}/api/favorites/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
  };

  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery<ProductInfo[], Error>({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites,
    isLoading,
    error,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
  };
};
