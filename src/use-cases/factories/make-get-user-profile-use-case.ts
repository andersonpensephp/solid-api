import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetUserProfileUseCase } from "../getUserProfileUseCase";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUserRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

  return getUserProfileUseCase;
}
