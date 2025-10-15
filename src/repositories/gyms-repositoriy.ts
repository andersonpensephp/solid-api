import { CreateGymUseCaseParams } from "@/@types/gym";
import { Gym } from "@prisma/client";
import { SearchNearbyGymsParams } from "@/@types/gym";

export interface GymsRepository {
  create(data: CreateGymUseCaseParams): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  searchNearby(params: SearchNearbyGymsParams): Promise<Gym[]>;
}