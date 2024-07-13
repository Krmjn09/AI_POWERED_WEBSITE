'use client'
import React, { useState, useEffect } from 'react'
import { useAutosave } from 'react-autosave'
import { updatedEntry } from '@/utils/api'

interface EditorProps {
  entry: {
    id: string
    content: string
  } | null
}

const Editor = ({ entry }: EditorProps) => {
  const [value, setValue] = useState(entry?.content || '')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (entry) {
      setValue(entry.content)
    }
  }, [entry])

  useAutosave({
    
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      if (entry) {
        await updatedEntry(entry.id, _value)
      }
      setIsLoading(false)
    },
  })

  if (!entry) {
    return <div>No entry found.</div>
  }

  return (
    <div className="w-full h-full">
      {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">Saving...</div>}
      <textarea
        className="w-full h-full text-xl p-8 outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default Editor
