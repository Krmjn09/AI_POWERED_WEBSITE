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
  await prisma.analysis.update({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
    entryId : updatedEntry.id,
    ...analysis, 
    },
    update  : analysis ? analysis : {},
  })
  console.log(updated)



  return NextResponse.json({ data: updatedEntry })
}
