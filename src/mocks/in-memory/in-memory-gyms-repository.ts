import { Gym, Prisma } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repositoriy";
import { randomUUID } from "node:crypto";
import { CreateGymUseCaseParams } from "@/types/gym";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === id) || null;
  }

  async create(data: CreateGymUseCaseParams): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? '',
      phone: data.phone ?? '',
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };

    this.gyms.push(gym);

    return gym;
  }
}
