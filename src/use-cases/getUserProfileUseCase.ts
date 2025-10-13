import { UserRepository } from "@/repositories/user-repository";
import { User } from "generated/prisma";

type UserResponse = Omit<User, 'password_hash'>;

export interface GetUserProfileUseCaseRequest {
  userId: string;
}

export interface GetUserProfileUseCaseResponse {
  user: UserResponse;
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      }
    };
  }
}
