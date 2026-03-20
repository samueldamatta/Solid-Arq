import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './erros/invalid-credentials-error.js'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Register use case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

        it("should be able to authenticate", async () => {
            await usersRepository.create({
                name: "John Doe",
                email: "john.doe@example.com",
                password_hash: await hash("12345678", 6),
            })

            const { user } = await sut.execute({
                email: "john.doe@example.com",
                password: "12345678",
            })

            expect(user.id).toEqual(expect.any(String))
        })

        it("should not be able to authenticate with wrong email", async () => {
            await expect(sut.execute({
                email: "john.doe@example.com",
                password: "12345678",
            })).rejects.toBeInstanceOf(InvalidCredentialsError)
        })

        it("should not be able to authenticate with wrong password", async () => {
            await usersRepository.create({
                name: "John Doe",
                email: "john.doe@example.com",
                password_hash: await hash("12345678", 6),
            })

            await expect(sut.execute({
                email: "john.doe@example.com",
                password: "123456789",
            })).rejects.toBeInstanceOf(InvalidCredentialsError)
        })
})