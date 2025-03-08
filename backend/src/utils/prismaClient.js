import { PrismaClient } from '@prisma/client'
import '../middlewares/updateOverallScore.js'
export const prisma = new PrismaClient()
