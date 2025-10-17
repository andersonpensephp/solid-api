import { UserRepository } from "@/repositories/user-repository";
import bcryptjs from "bcryptjs";
import { UserAlreadyExistsError } from "./erros/user-errors";
import { User } from "@prisma/client";

export interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository
  ) { }

  async execute({ name, email, password, role }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await bcryptjs.hash(password, 6);

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const body = {
      name,
      email,
      password_hash,
      role
    };

    const user = await this.userRepository.create(body);

    return {
      user
    };
  }
}
