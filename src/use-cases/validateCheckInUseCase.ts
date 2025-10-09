import { CheckInRepository } from "@/repositories/check-in-repository";
import dayjs from "dayjs";

export interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository
  ) { }

  async execute({ checkInId }: ValidateCheckInUseCaseRequest) {
    const checkIn = await this.checkInRepository.findCheckInById(checkInId)

    if (!checkIn) {
      throw new Error('Check-in not found')
    }

    const distanceInMinutesFromCheckInCreation = dayjs().diff(
      checkIn.created_at,
      'minute'
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new Error('Check-in not validated')
    }

    checkIn.validated_at = new Date()

    try {
      return await this.checkInRepository.save(checkIn)
    } catch (error) {
      throw new Error('Check-in not validated')
    }
  }
}