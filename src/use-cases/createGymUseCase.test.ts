import { beforeEach, describe, it, expect, vi } from "vitest";
import { InMemoryGymsRepository } from "@/mocks/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./createGymUseCase";

describe('CreateGymUseCase', () => {
  let gymsRepository: InMemoryGymsRepository;
  let createGymUseCase: CreateGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(gymsRepository);
  })

  it('should be able to create a gym', async () => {
    const gym = await createGymUseCase.execute({
      title: 'Gym 01',
      description: 'Gym 01',
      phone: '123456789',
      latitude: 0,
      longitude: 0,
    })

    expect(gym).toEqual({
      gym: expect.objectContaining({
        title: 'Gym 01',
        description: 'Gym 01',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    })
  })
})
