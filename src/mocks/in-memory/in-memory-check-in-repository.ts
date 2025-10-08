import { CheckIn, Prisma } from "generated/prisma";
import { CheckInRepository } from "@/repositories/check-in-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const createdAt =
      data.created_at instanceof Date
        ? data.created_at
        : data.created_at
          ? new Date(data.created_at)
          : new Date();

    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: createdAt,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfToday = dayjs(date).startOf('day')
    const endOfToday = dayjs(date).endOf('day')
    const checkIn = this.checkIns.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at >= startOfToday.toDate() &&
        checkIn.created_at <= endOfToday.toDate()
    );
    return checkIn || null;
  }
} 