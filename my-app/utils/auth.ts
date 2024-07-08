import { prisma } from './db'
import { auth } from '@clerk/nextjs/server'

export const getUserByClerkID = async () => {
  const { userId } = await auth()

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
  })

  return user
}
