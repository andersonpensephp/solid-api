import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/mocks/in-memory/in-memory-check-in-repository";
import { InMemoryUsersRepository } from "@/mocks/in-memory/in-memory-users-repository";
import { MemberCheckInHistoryUseCase } from "./memberCheckInHistoryUseCase";
import { User } from "generated/prisma";

describe('MemberCheckInHistoryUseCase', () => {
  let checkInRepository: InMemoryCheckInRepository;
  let checkInUseCase: MemberCheckInHistoryUseCase;
  let userRepository: InMemoryUsersRepository
  let user: User

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    userRepository = new InMemoryUsersRepository();
    checkInUseCase = new MemberCheckInHistoryUseCase(checkInRepository, userRepository);

    vi.useFakeTimers()

    user = await userRepository.create({
      name: 'User 01',
      email: 'user-01@example.com',
      password_hash: '123456',
    })


  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get check-in history', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: user.id,
    })
    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: user.id,
    })
    const checkIn = await checkInUseCase.execute({ userId: user.id })

    expect(checkIn).toHaveLength(2)
    expect(checkIn).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: 'gym-02',
        user_id: user.id,
      })
    ])
  })

  it('pagination should work', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: user.id,
      })
    }
    const checkIn = await checkInUseCase.execute({ userId: user.id, page: 2 })
    expect(checkIn).toHaveLength(2)
    expect(checkIn).toEqual([
      expect.objectContaining({
        gym_id: 'gym-21',
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: 'gym-22',
        user_id: user.id,
      })
    ])
  })
})
