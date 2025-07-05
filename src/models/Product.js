import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const Product = prisma.product
