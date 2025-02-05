import { useQuery } from '@tanstack/react-query';

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${ApiURL}/api/categories`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

