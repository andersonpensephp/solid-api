import { Gym } from "generated/prisma";
import { CreateGymUseCaseParams } from "@/types/gym";

export interface GymsRepository {
  create(data: CreateGymUseCaseParams): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
}