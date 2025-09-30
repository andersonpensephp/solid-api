import { RegisterUseCase } from "../registerUseCase";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}