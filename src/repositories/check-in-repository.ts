import { CheckIn, Prisma } from "generated/prisma";

export interface CheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findCheckinHistoryByUserId(userId: string, page?: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  findCheckInById(checkInId: string): Promise<CheckIn | null>;
  save(checkIn: CheckIn): Promise<CheckIn>;
}
