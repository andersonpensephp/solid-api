import { beforeEach, describe, it, expect } from "vitest"
import { InMemoryGymsRepository } from "@/mocks/in-memory/in-memory-gyms-repository"
import { SearchNearbyGymsUseCase } from "./searchNearbyGymsUseCase"

describe('SearchNearbyGymsUseCase', () => {
  let gymsRepository: InMemoryGymsRepository;
  let searchNearbyGymsUseCase: SearchNearbyGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    searchNearbyGymsUseCase = new SearchNearbyGymsUseCase(gymsRepository);
  })

  it('should be able to search nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 01',
      description: 'Gym 01',
      phone: '123456789',
      latitude: -22.5990502,
      longitude: -43.8970846,
    })

    const gyms = await searchNearbyGymsUseCase.execute({
      userLatitude: -22.50896,
      userLongitude: -43.89708,
    })

    expect(gyms).toHaveLength(1)
  })

  it('should not be able to search nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Gym 01',
      description: 'Gym 01',
      phone: '123456789',
      latitude: -22.5990502,
      longitude: -43.8970846,
    })

    const gyms = await searchNearbyGymsUseCase.execute({
      userLatitude: -22.46395,
      userLongitude: -43.89708,
    })

    expect(gyms).toHaveLength(0)
  })
})