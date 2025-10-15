import { Prisma, CheckIn } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CheckInRepository } from "../check-in-repository";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }
  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfToday = dayjs.utc(date).startOf('day')
    const endOfToday = dayjs.utc(date).endOf('day')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfToday.toDate(),
          lte: endOfToday.toDate(),
        },
      },
    })

    return checkIn
  }
  async findCheckinHistoryByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }
  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }
  async findCheckInById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    })
    return checkIn || null
  }
  async save(checkIn: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })

    return updatedCheckIn
  }
}