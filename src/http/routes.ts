import { handlerRegister } from "./controllers/register";
import { handlerAuthenticate } from "./controllers/authenticate";
import { FastifyInstance } from "fastify";
import { handlerProfile } from "./controllers/profile";
import { authorization } from "./middlewares/authorization";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', handlerRegister);
  app.post('/sessions', handlerAuthenticate);

  /** Authenticated routes */
  app.get('/me', { preHandler: authorization }, handlerProfile);
}
