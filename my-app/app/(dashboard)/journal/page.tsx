import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { analyse } from '@/utils/ai'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import Link from 'next/link'

const getEntries = async () => {
  const user = await getUserByClerkID()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  await analyse(
    `I am going to give you an journal entry,i want you to analyze for a few things. I need the mood, a summary , what the subject is , and a color representing the mood. You need to respond back with formatted JSON LIKE SO: {"mood":"","subject":"","color":"","negative":""}. 
    entry:
    Today was a good day. I went to the park and played with my dog. I had a lot of fun. I felt happy. I am grateful for my dog.
    `
  )
  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()
  return (
    <div className="p-10 bg-zinc-400/10 h-100vh">
      <h2 className="text-3xl mb-4">Journal</h2>
      <div className="grid grid-cols-3 gap-4 p-10 ">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link href={`/journal/${entry.id}`} key={entry.id}>
            <EntryCard key={entry.id} entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default JournalPage
