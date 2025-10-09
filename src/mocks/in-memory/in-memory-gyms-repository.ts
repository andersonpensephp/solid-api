import { Gym, Prisma } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repositoriy";
import { randomUUID } from "node:crypto";
import { CreateGymUseCaseParams } from "@/types/gym";
import { SearchNearbyGymsParams } from "@/types/gym";
import { getDistanceBetweenCoordinates } from "@/utils/getDistanceBetweenCoordinates";

const distanceInMeters = 10000;

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

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async searchNearby(params: SearchNearbyGymsParams): Promise<Gym[]> {
    const positionUser = {
      latitude: params.latitude,
      longitude: params.longitude,
    }
    return this.gyms
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates({
          point1: {
            latitude: gym.latitude,
            longitude: gym.longitude,
          },
          point2: positionUser
        });
        return distance <= distanceInMeters;
      })
    // .slice((page - 1) * 20, page * 20);
  }
}
