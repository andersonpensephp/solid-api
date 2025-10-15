import { prisma } from "@/lib/prisma"
import { GymsRepository } from "../gyms-repositoriy"
import { Prisma, Gym } from "@prisma/client"
import { SearchNearbyGymsParams } from "@/@types/gym"

export class PrismaGymRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } })

    return gym
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }
  async searchNearby({ latitude, longitude }: SearchNearbyGymsParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT *
      FROM gyms
      WHERE (
        6371 * ACOS(
          COS(RADIANS(${latitude})) *
          COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(${longitude})) +
          SIN(RADIANS(${latitude})) *
          SIN(RADIANS(latitude))
        )
      ) <= 10;
    `

    return gyms
  }
}