import { handlerRegister } from "./register";
import { handlerAuthenticate } from "./authenticate";
import { FastifyInstance } from "fastify";
import { handlerProfile } from "./profile";
import { authorization } from "../../middlewares/authorization";
import { handlerRefreshToken } from "./refreshToken";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', handlerRegister);
  app.post('/sessions', handlerAuthenticate);
  app.patch('/token/refresh', handlerRefreshToken);

  /** Authenticated routes */
  app.get('/me', { preHandler: authorization }, handlerProfile);
}
