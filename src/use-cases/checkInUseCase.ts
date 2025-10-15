
import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repositoriy";
import { getDistanceBetweenCoordinates } from "@/utils/getDistanceBetweenCoordinates";

export interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

export interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymsRepository: GymsRepository
  ) { }
  async execute({ gymId, userId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const maxDistanceInMeters = 10000

    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new Error('Gym not found')
    }
    const checkInOnDate = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnDate) {
      throw new Error('User already checked in today')
    }


    const point1 = {
      latitude: userLatitude,
      longitude: userLongitude,
    }

    const point2 = {
      latitude: gym?.latitude,
      longitude: gym?.longitude,
    }

    const distanceInMeters = getDistanceBetweenCoordinates({
      point1,
      point2,
    });

    if (distanceInMeters > maxDistanceInMeters) {
      throw new Error('Gym too far')
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
