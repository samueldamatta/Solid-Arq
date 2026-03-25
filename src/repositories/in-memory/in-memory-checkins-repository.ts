import type { CheckIn, Prisma } from "@prisma/client";
import type { CheckInsRepository } from "../prisma/check-ins-repository.js";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {

        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.createdAt)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
            return checkIn.user_id === userId && isOnSameDate
        })

        if (!checkInOnSameDate) {
            return null
        }

        return checkInOnSameDate
    }

    async findManyByUserId(userId: string, page: number) {
        return this.items.filter((item) => item.user_id === userId)
        .slice((page - 1) * 20, page * 20)
    }
    
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            createdAt: new Date(),
            validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
        }

        this.items.push(checkIn)

        return checkIn
    }
}