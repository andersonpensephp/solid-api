import { Prisma, User } from "@prisma/client";
import { UserRepository } from "@/repositories/user-repository";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const createdAt =
      data.created_at instanceof Date
        ? data.created_at
        : data.created_at
          ? new Date(data.created_at)
          : new Date();

    const user: User = {
      id: String(this.users.length + 1),
      name: data.name || '',
      email: data.email || '',
      password_hash: data.password_hash || '',
      created_at: createdAt,
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email) || null;
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id) || null;
    return user;
  }
}