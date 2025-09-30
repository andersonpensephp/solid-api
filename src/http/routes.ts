import { handlerRegister } from "./controllers/register";
import { handlerAuthenticate } from "./controllers/authenticate";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', handlerRegister);
  app.post('/sessions', handlerAuthenticate);
}
