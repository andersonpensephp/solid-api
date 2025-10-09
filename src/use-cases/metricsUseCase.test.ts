import { beforeEach, describe, it, expect } from "vitest"
import { InMemoryCheckInRepository } from "@/mocks/in-memory/in-memory-check-in-repository"
import { MetricsUseCase } from "./metricsUseCase"

describe('MetricsUseCase', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let metricsUseCase: MetricsUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    metricsUseCase = new MetricsUseCase(checkInRepository);
  })

  it('should be able to get metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    const metrics = await metricsUseCase.execute({ userId: 'user-01' })
    expect(metrics).toEqual({
      checkInsCount: 2
    })
  })
})