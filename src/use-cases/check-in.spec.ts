import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInUseCase } from './check-in.js'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository.js'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error.js'
import { MaxDistanceError } from './erros/max-distance-error.js'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Check in use case", () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        vi.useFakeTimers()

        gymsRepository.items.push({
            id: "gym-1",
            title: "Gym 1",
            description: "Gym 1 description",
            phone: "1234567890",
            latitude: -27.2092052,
            longitude: -49.6401091,
        })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

        it("should be able to check in", async () => {

            const { checkIn } = await sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })

            expect(checkIn.id).toEqual(expect.any(String))
        })


        //red, green, refactor

        it("should not be able to check in twice in the same day", async () => {

            vi.setSystemTime(new Date(2026, 2, 20, 10, 0, 0))
                await sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })

            await expect(sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
        })

        it("should be able to check in twice but in different days", async () => {
            vi.setSystemTime(new Date(2026, 2, 20, 10, 0, 0))
            await sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })

            vi.setSystemTime(new Date(2026, 2, 21, 10, 0, 0))

            const { checkIn } = await sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })

            expect(checkIn.id).toEqual(expect.any(String))
        })

        it("should not be able to check in on a distant gym", async () => {

            gymsRepository.items.push({
                id: "gym-2",
                title: "Gym 1",
                description: "Gym 1 description",
                phone: "1234567890",
                latitude: -27.0747279,
                longitude: -48.4889672,
            })

            await expect(sut.execute({
                userId: "user-1",
                gymId: "gym-2",
                userLatitude: -27.2092052,
                userLongitude: -49.6401091,
            })).rejects.toBeInstanceOf(MaxDistanceError)
        })
})