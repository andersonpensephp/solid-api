import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/mocks/in-memory/in-memory-check-in-repository";
import { ValidateCheckInUseCase } from "./validateCheckInUseCase";

describe('ValidateCheckInUseCase', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let validateCheckInUseCase: ValidateCheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
    const checkIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const validatedCheckIn = await validateCheckInUseCase.execute({
      checkInId: checkIn.id,
    })

    expect(validatedCheckIn).toEqual(expect.objectContaining({
      validated_at: expect.any(Date),
    }))
  })

  it('should not be able to validate a check-in that does not exist', async () => {
    await expect(() => validateCheckInUseCase.execute({
      checkInId: 'non-existing-check-in-id',
    })).rejects.toThrow('Check-in not found')
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date())

    const checkIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    vi.advanceTimersByTime(21 * 60 * 1000)

    await expect(() => validateCheckInUseCase.execute({
      checkInId: checkIn.id,
    })).rejects.toThrow('Check-in not validate')
  })
}) 
