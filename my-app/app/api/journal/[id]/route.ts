import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'
import { getUserByClerkID } from '@/utils/auth'
import { revalidatePath } from 'next/cache'

export const PATCH = async (request: Request, { params }: { params: any }) => {
  const { content } = await request.json()
  const user = await getUserByClerkID()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })

 

  return NextResponse.json({ data: updatedEntry })
}
