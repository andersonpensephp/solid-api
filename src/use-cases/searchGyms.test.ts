import { beforeEach, describe, it, expect } from "vitest"
import { InMemoryGymsRepository } from "@/mocks/in-memory/in-memory-gyms-repository"
import { SearchGymsUseCase } from "./searchGymsUseCase"

describe('SearchGymsUseCase', () => {
  let gymsRepository: InMemoryGymsRepository;
  let searchGymsUseCase: SearchGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
  })

  it('should be able to search gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: `Gym ${i}`,
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    }

    const gyms = await searchGymsUseCase.execute({ query: 'Gym', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 21'
      }),
      expect.objectContaining({
        title: 'Gym 22'
      })
    ])
  })
})