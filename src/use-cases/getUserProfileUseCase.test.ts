import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/mocks/in-memory/in-memory-users-repository";
import bcryptjs from "bcryptjs";
import { GetUserProfileUseCase } from "./getUserProfileUseCase";

describe('GetUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await bcryptjs.hashSync('123456', 6),
    });

    const { user: userResponse } = await sut.execute({ userId: user.id });

    expect(userResponse).toEqual(user);
  });

  it('should not be able to get user profile with invalid user id', async () => {
    await expect(() =>
      sut.execute({ userId: 'invalid-user-id' })
    ).rejects.toThrow('User not found');
  });
});