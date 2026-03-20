import { describe, expect, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './erros/user-already-exists-error.js'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase


describe("Register use case", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it("should be able to register", async () => {
        const { user } = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "12345678",
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash user password upon registration", async () => {
        const { user } = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "12345678",
        })

        const isPasswordHashed = await compare(
            "12345678",
            user.password_hash
        )

        expect(isPasswordHashed).toBe(true)
    })

    it("should not be able to register with same email twice", async () => {
        const email = "john.doe@example.com"

        await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "12345678",
        })

        await expect(sut.execute({
            name: "John Doe",
            email: email,
            password: "12345678",
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})