import type { FastifyRequest, FastifyReply } from 'fastify';

export async function handlerRefreshToken(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true,
  })

  const token = await reply.jwtSign({
    role: request.user.role,
  }, {
    sign: {
      sub: request.user.sub,
    }
  })

  const refreshToken = await reply.jwtSign({
    role: request.user.role,
  }, {
    sign: {
      expiresIn: '7d',
      sub: request.user.sub,
    }
  })

  return reply.setCookie('refreshToken', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })
    .status(200)
    .send({ token })
}
