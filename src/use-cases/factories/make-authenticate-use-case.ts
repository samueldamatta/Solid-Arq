import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"
import { AuthenticateUseCase } from "../authenticate.js"
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository.js"

export function makeAuthenticateUseCase() {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    return authenticateUseCase
}