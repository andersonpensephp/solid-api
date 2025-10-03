
import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "generated/prisma";

export interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

export interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository
  ) { }
  async execute({ gymId, userId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnDate = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnDate) {
      throw new Error('User already checked in today')
    }
    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn
    };
  }
}
