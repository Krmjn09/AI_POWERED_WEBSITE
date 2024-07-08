const createURL = (path: string) => {
  return window.location.origin + path
}

export const createNewEntry = async () => {
  const response = await fetch(
    new Request(createURL('/api/journal'), {
      method: 'POST',
      body: JSON.stringify({}),
    })
  )

  if (response.ok) {
    const data = await response.json()
    return data.data
  }
}
