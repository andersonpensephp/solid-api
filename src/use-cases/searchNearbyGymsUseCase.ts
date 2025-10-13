import { GymsRepository } from "@/repositories/gyms-repositoriy";

interface SearchNearbyGymsUseCaseParams {
  userLatitude: number;
  userLongitude: number;
}

export class SearchNearbyGymsUseCase {
  constructor(
    private gymsRepository: GymsRepository
  ) { }

  async execute({ userLatitude, userLongitude }: SearchNearbyGymsUseCaseParams) {
    const gyms = await this.gymsRepository.searchNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return gyms
  }
}