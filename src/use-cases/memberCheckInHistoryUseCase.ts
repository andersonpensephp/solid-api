import { CheckInRepository } from "@/repositories/check-in-repository";
import { UserRepository } from "@/repositories/user-repository";
import { UserNotFoundError } from "./erros/user-errors";

export class MemberCheckInHistoryUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private userRepository: UserRepository
  ) { }

  async execute({ userId, page = 1 }: { userId: string, page?: number }) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const checkIns = await this.checkInRepository.findCheckinHistoryByUserId(userId, page)

    return checkIns

  }
}
