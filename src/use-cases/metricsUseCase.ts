import { CheckInRepository } from "@/repositories/check-in-repository"

export class MetricsUseCase {
  constructor(
    private checkInRepository: CheckInRepository
  ) { }

  async execute({ userId }: { userId: string }) {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)
    return {
      checkInsCount
    }
  }
}
