'use client'

interface EditorProps {
  entry: {
    content: string
  }
}

const Editor = ({ entry }: EditorProps) => {
  return <div>{entry.content}</div>
}

export default Editor
