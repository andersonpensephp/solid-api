import { Prisma } from "generated/prisma";

export type CreateGymUseCaseParams = Omit<Prisma.GymCreateInput, 'description' | 'phone'> & {
  description?: string | null;
  phone?: string | null;
}

export interface SearchNearbyGymsParams {
  latitude: number;
  longitude: number;
}
