import fastify from "fastify";
import { appRoutes } from "./http/controllers/routes.js";
import { UserAlreadyExistsError } from "./use-cases/erros/user-already-exists-error.js";
import { ZodError } from "zod";
import { env } from "./env/index.js";
export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    }else {
        // LOG para uma ferramenta externa
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})