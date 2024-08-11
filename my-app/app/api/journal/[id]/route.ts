import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'
import { getUserByClerkID } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { analyze } from '@/utils/ai'

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
const analysis = await analyze(updatedEntry.content)
  await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    data: {
      entryId: updatedEntry.id,
      ...analysis,
    },
    update:       analysis

  })




  return NextResponse.json({ data: updatedEntry })
}
