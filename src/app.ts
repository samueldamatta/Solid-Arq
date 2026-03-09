import fastify from "fastify";
import { appRoutes } from "./http/controllers/routes.js";

export const app = fastify()

app.register(appRoutes)