import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/mocks/in-memory/in-memory-check-in-repository";
import { CheckInUseCase } from "./checkInUseCase";
import { InMemoryGymsRepository } from "@/mocks/in-memory/in-memory-gyms-repository";
import { Gym } from "generated/prisma";

describe('CheckInUseCase', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let checkInUseCase: CheckInUseCase;
  let gymsRepository: InMemoryGymsRepository;
  let gym: Gym

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository);

    vi.useFakeTimers()

    gym = await gymsRepository.create({
      title: 'Gym 01',
      description: 'Gym 01',
      phone: '123456789',
      latitude: 0,
      longitude: 0,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkIn = await checkInUseCase.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn).toEqual({
      checkIn: expect.objectContaining({
        gym_id: gym.id,
        user_id: 'user-01',
      })
    })
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 9, 1))

    await checkInUseCase.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toThrow('User already checked in today')
  })
  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 9, 1))

    await checkInUseCase.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2025, 9, 2))
    await checkInUseCase.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkInRepository.checkIns).toHaveLength(2)
  })
  it('should not be able to check in on a gym too far', async () => {
    const newGym = await gymsRepository.create({
      title: 'Gym 02',
      description: 'Gym 02',
      phone: '123456744',
      latitude: -22.5990502,
      longitude: -43.8970846,
    })

    vi.setSystemTime(new Date(2025, 9, 1))

    await expect(() =>
      checkInUseCase.execute({
        gymId: newGym.id,
        userId: 'user-01',
        userLatitude: -22.6147389,
        userLongitude: -43.8970846,
      })
    ).rejects.toThrow('Gym too far')
  })
})