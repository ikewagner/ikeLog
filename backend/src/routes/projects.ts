import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function projectsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })


  app.get('/projects', async (request) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return projects.map((project) => {
      return {
        id: project.id,
        excerpt: project.description.substring(0, 115).concat('...'),
        createdAt: project.createdAt,
      }
    })
  })
}
