import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { GetUserMetricsUseCase } from './get-user-metrics.js'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe("Get user metrics use case", () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)
    })

        it("should be able to get check-ins count from metrics", async () => {

            await checkInsRepository.create({
                user_id: "user-01",
                gym_id: "gym-01",
            })

            await checkInsRepository.create({
                user_id: "user-01",
                gym_id: "gym-02",
            })

            const { checkInsCount } = await sut.execute({
                userId: "user-01",
            })

            expect(checkInsCount).toEqual(2)    
        })
        
})