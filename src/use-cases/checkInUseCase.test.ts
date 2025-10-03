import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/mocks/in-memory/in-memory-check-in-repository";
import { CheckInUseCase } from "./checkInUseCase";

describe('CheckInUseCase', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    checkInUseCase = new CheckInUseCase(checkInRepository);

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkIn = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn).toEqual({
      checkIn: expect.objectContaining({
        gym_id: 'gym-01',
        user_id: 'user-01',
      })
    })
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 9, 1))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      })
    ).rejects.toThrow('User already checked in today')
  })
  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 9, 1))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2025, 9, 2))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkInRepository.checkIns).toHaveLength(2)
  })
})