import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { ValidateCheckInUseCase } from "../validateCheckInUseCase";

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository);

  return validateCheckInUseCase;
} 