'use client'
import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NewEntryCard = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOnClick = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await createNewEntry()
      if (!data || !data.id) {
        throw new Error('Invalid response from the server')
      }
      router.push(`/journal/${data.id}`)
    } catch (error) {
      setError('created New Entry ')
      console.error('Error creating new entry:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={handleOnClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default NewEntryCard
