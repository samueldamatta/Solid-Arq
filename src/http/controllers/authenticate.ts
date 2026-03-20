import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"
import { AuthenticateUseCase } from "../../use-cases/authenticate.js"
import { InvalidCredentialsError } from "../../use-cases/erros/invalid-credentials-error.js"

export async function authenticate (request: FastifyRequest, reply: FastifyReply){

    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)

        await authenticateUseCase.execute({ 
            email,
            password,
        });

    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message })
        }
        throw error
    }

    return reply.status(200).send()
}