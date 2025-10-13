import { PrismaGymRepository } from "@/repositories/prisma/priema-gyms-repository";
import { CheckInUseCase } from "../checkInUseCase";
import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const gymsRepository = new PrismaGymRepository();
  const checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

  return checkInUseCase;
}