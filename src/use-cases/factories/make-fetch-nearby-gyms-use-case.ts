import { PrismaGymRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchNearbyGymsUseCase } from "../searchNearbyGymsUseCase";

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const fetchNearbyGymsUseCase = new SearchNearbyGymsUseCase(gymsRepository);

  return fetchNearbyGymsUseCase;
}