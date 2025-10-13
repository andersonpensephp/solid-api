import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { MemberCheckInHistoryUseCase } from "../memberCheckInHistoryUseCase";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";

export function makeFetchUserCheckinsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const userRepository = new PrismaUserRepository();
  const fetchUserCheckinsHistoryUseCase = new MemberCheckInHistoryUseCase(checkInRepository, userRepository);

  return fetchUserCheckinsHistoryUseCase;
}
