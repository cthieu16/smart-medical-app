import { useQuery } from "@tanstack/react-query";

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export type SpecialtyDoctor = {
  id: string;
  specialty: string | null;
  fullName: string;
  code: string;
  userId: string;
  specialtyId: string;
  phone: string;
  address: string;
  email: string | null;
  chanelNumber: string;
  departmentId: string;
  clinicId: string | null;
};

export type Specialty = {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  doctors: SpecialtyDoctor[];
};

export type SpecialtiesResponse = {
  success: boolean;
  data: {
    items: Specialty[];
    totalRecords: number;
    page: number;
    pageSize: number;
  };
  message: string;
  errors: string[];
};

export type DoctorsBySpecialtyResponse = {
  success: boolean;
  data: SpecialtyDoctor[];
  message: string;
  errors: string[];
};

const fetchAllSpecialties = async (): Promise<Specialty[]> => {
  const response = await fetch(`${ApiURL}/specialties`, {
    headers: {
      'accept': 'text/plain',
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch specialties");
  }

  const jsonResponse: SpecialtiesResponse = await response.json();
  
  if (!jsonResponse.success) {
    throw new Error(jsonResponse.message || "Failed to fetch specialties");
  }

  return jsonResponse.data.items;
};

const fetchDoctorsBySpecialty = async (specialtyId: string): Promise<SpecialtyDoctor[]> => {
  const response = await fetch(`${ApiURL}/specialties/${specialtyId}/doctors`, {
    headers: {
      'accept': 'text/plain',
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctors by specialty");
  }

  const jsonResponse: DoctorsBySpecialtyResponse = await response.json();
  
  if (!jsonResponse.success) {
    throw new Error(jsonResponse.message || "Failed to fetch doctors by specialty");
  }

  return jsonResponse.data;
};

export const useSpecialties = () => {
  return useQuery<Specialty[], Error>({
    queryKey: ["specialties"],
    queryFn: fetchAllSpecialties,
  });
};

export const useSpecialty = (specialtyId: string) => {
  return useQuery<Specialty | undefined, Error>({
    queryKey: ["specialty", specialtyId],
    queryFn: async () => {
      const specialties = await fetchAllSpecialties();
      return specialties.find(specialty => specialty.id === specialtyId);
    },
    enabled: !!specialtyId,
  });
};

export const useSpecialtiesWithDoctors = () => {
  return useQuery<Specialty[], Error>({
    queryKey: ["specialties-with-doctors"],
    queryFn: async () => {
      const specialties = await fetchAllSpecialties();
      return specialties.filter(specialty => specialty.doctors.length > 0);
    },
  });
};

export const useDoctorsBySpecialty = (specialtyId: string) => {
  return useQuery<SpecialtyDoctor[], Error>({
    queryKey: ["doctors-by-specialty", specialtyId],
    queryFn: () => fetchDoctorsBySpecialty(specialtyId),
    enabled: !!specialtyId,
  });
};
