import { PrismaGymRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsUseCase } from "@/use-cases/searchGymsUseCase";

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);

  return searchGymsUseCase;
}
