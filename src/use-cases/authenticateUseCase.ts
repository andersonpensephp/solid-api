import { UserRepository } from "@/repositories/user-repository";
import bcryptjs from "bcryptjs";
import { User } from "@prisma/client";
import { InvalidCredentialsError } from "./erros/user-errors";

export interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

export interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(
    private userRepository: UserRepository
  ) { }

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }

    return {
      user
    };
  }
}
