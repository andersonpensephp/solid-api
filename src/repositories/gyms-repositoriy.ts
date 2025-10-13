import { Gym } from "generated/prisma";
import { CreateGymUseCaseParams, SearchNearbyGymsParams } from "@/@types/gym";

export interface GymsRepository {
  create(data: CreateGymUseCaseParams): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  searchNearby(params: SearchNearbyGymsParams): Promise<Gym[]>;
}