import { PrismaGymRepository } from "@/repositories/prisma/priema-gyms-repository";
import { CreateGymUseCase } from "../createGymUseCase";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);

  return createGymUseCase;
}