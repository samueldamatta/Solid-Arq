import type { FastifyInstance } from "fastify";
import { register } from "./register.js";


export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
}