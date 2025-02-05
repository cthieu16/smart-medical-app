import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type OrderStatus = "PROCESSING" | "CONFIRMED" | "DELIVERED" | "CANCELED";

export type Order = {
  id: string;
  trackingNumber: string;
  status: OrderStatus;
  purchaseDate: string;
  quantity: number;
  productListing: {
    productId: string;
    price: number;
    stock: number;
  };
};

export const useOrders = () => {
  const getToken = async () => {
    const token = await AsyncStorage.getItem("@token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${ApiURL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json() as Promise<Order[]>;
    },
  });
};

export const useOrder = (orderId: string) => {
  const getToken = async () => {
    const token = await AsyncStorage.getItem("@token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`${ApiURL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      return response.json() as Promise<Order>;
    },
  });
};
