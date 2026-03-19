import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register.js'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './erros/user-already-exists-error.js'

describe("Register use case", () => {

    it("should be able to register", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "12345678",
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash user password upon registration", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase({
            async create(data) {
                return {
                    id: "user-1",
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    createdAt: new Date(),
                    checkIns: [],
                }
            },
            async findByEmail(email) {
                return null
            },
        })

        const { user } = await registerUseCase.execute({
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
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = "john.doe@example.com"

        await registerUseCase.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "12345678",
        })

        expect(registerUseCase.execute({
            name: "John Doe",
            email: email,
            password: "12345678",
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})