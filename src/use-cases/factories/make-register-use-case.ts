import { RegisterUseCase } from "../register.js"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"

export function makeRegisterUseCase() {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    return registerUseCase
}