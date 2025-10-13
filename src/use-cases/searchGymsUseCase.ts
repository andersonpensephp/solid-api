import { GymsRepository } from "@/repositories/gyms-repositoriy";

export class SearchGymsUseCase {
  constructor(
    private gymsRepository: GymsRepository
  ) { }

  async execute({ query, page }: { query: string, page: number }) {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return gyms
  }
}