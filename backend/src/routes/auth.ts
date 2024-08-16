import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const registerSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = registerSchema.parse(request.body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findFirst({
      where: { email },
    })

    if (existingUser) {
      return reply.status(400).send({ error: 'Email já está em uso' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // Generate JWT token using Fastify JWT
    const token = app.jwt.sign({ userId: user.id }, { expiresIn: '1h' })

    // Optionally, you can also create a user in Supabase if needed
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // })

    return reply.send({ token })
  })
}