import { UserRepository } from "@/repositories/user-repository";
import { User } from "generated/prisma";

export interface GetUserProfileUseCaseRequest {
  userId: string;
}

export interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(
    private userRepository: UserRepository
  ) { }

  async execute({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user
    };
  }
}
