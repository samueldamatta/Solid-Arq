import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGymUseCase } from './create-gym.js'
import { vi } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase


describe("Create gym use case", () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)

        await gymsRepository.create({
            id: "gym-1",
            title: "Gym 1",
            description: "Gym 1 description",
            phone: "1234567890",
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        vi.useFakeTimers()
    })

    it("should be able to create a gym", async () => {
        const { gym } = await sut.execute({
            title: "Gym 1",
            description: "Gym 1 description",
            phone: "1234567890",
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})