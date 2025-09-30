import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticateUseCase";
import { InMemoryUsersRepository } from "@/mocks/in-memory/in-memory-users-repository";
import bcryptjs from "bcryptjs";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await bcryptjs.hashSync('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(user).toBeDefined();
  });

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await bcryptjs.hashSync('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'wrong.email@example.com',
        password: '123456',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await bcryptjs.hashSync('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: 'wrong.password',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});