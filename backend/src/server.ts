import 'dotenv/config'
import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { projectsRoutes } from "./routes/projects";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth';


const app = fastify();

app.register(multipart);

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: process.env.JWT_SECRET as string,
})

app.register(projectsRoutes);
app.register(authRoutes)

app.listen({ port: 3333 }, () => {
  console.log(`Server is running on port ${3333}`);
});
