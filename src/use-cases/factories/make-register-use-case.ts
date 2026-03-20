import { RegisterUseCase } from "../register.js"
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository.js"

export function makeRegisterUseCase() {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    return registerUseCase
}   