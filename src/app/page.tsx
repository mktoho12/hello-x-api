'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormEventHandler, useState } from 'react'

export default function Home() {
  const [apikey, setApikey] = useState('')
  const [apisecret, setApisecret] = useState('')
  const [output, setOutput] = useState('')

  const postTweet: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()

    const response = await fetch('/api/postTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apikey, apisecret }),
    })
    setOutput(await response.json())
  }

  return (
    <main>
      <form onSubmit={postTweet}>
        <Input value={apikey} onChange={e => setApikey(e.target.value)} />
        <Input value={apisecret} onChange={e => setApisecret(e.target.value)} />
        <Button>Click me</Button>
      </form>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </main>
  )
}
