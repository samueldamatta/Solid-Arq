import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInUseCase } from './check-in.js'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check in use case", () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

        it("should be able to check in", async () => {
            const checkIn = await checkInsRepository.create({
                user_id: "user-1",
                gym_id: "gym-1",
            })

            expect(checkIn.id).toEqual(expect.any(String))
        })
})