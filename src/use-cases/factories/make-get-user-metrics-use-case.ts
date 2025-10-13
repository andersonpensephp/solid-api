import { MetricsUseCase } from "../metricsUseCase";
import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";

export function makeGetUserMetricsUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const getUserMetricsUseCase = new MetricsUseCase(checkInRepository);

  return getUserMetricsUseCase;
}