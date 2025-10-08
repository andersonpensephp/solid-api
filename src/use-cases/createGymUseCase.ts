import { GymsRepository } from "@/repositories/gyms-repositoriy";
import { CreateGymUseCaseParams } from "@/types/gym";

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseParams) {
    const gym = await this.gymsRepository.create({
      title,
      ...(description && { description }),
      ...(phone && { phone }),
      latitude,
      longitude,
    })

    return {
      gym
    }
  }
}
