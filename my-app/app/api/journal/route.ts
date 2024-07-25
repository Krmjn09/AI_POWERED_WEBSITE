import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { analyze } from '@/utils/ai'

export const POST = async () => {
  try {
    const user = await getUserByClerkID()
    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: 'Write about your day!',
      },
    })

    const analysis = await analyze(entry.content)

    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to analyze the journal entry' },
        { status: 500 }
      )
    }

    const validAnalysis = {
      mood: analysis.mood || 'neutral',
      subject: analysis.subject || 'general',
      negative: analysis.negative ?? false,
      summary: analysis.summary || '',
      color: analysis.color || '#00FF00',
      sentimentScore: analysis.sentimentScore ?? 0,
      entryId: entry.id,
    }

    await prisma.analysis.create({ data: validAnalysis })
    revalidatePath('/journal')

    return NextResponse.json({ data: entry })
  } catch (error) {
    console.error('Error creating journal entry and analysis:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
