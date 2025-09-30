import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./registerUseCase";
import bcryptjs from "bcryptjs";
import { InMemoryUsersRepository } from "@/mocks/in-memory/in-memory-users-repository";

describe('RegisterUseCase', () => {
  it('should be able to register', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(user).toBeDefined();
  });

  it('should hash user password', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const isPasswordCorrect = await bcryptjs.compare('123456', user.password_hash);
    expect(isPasswordCorrect).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const email = 'john.doe@example.com';

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    ).rejects.toThrow('User already exists');
  });
});
