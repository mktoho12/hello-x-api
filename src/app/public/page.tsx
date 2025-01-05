'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

export default function Public() {
  const [output, setOutput] = useState<{ [key: string]: object | number }>()

  const createAuthURL = () => {
    const url = 'https://twitter.com/i/oauth2/authorize'
    const searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_X_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_X_REDIRECT_URI,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: 'state',
      code_challenge: 'challenge',
      code_challenge_method: 'plain',
    })
    return `${url}?${searchParams.toString()}`
  }

  const authURL = createAuthURL()

  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    fetch('/api/session').then(response => {
      if (response.ok) {
        response.json().then(data => {
          setSignedIn(data.signed_in)
        })
      }
    })
  }, [])

  const [text, setText] = useState('')
  const postTweet = async () => {
    const response = await fetch('/api/postTweet', {
      body: JSON.stringify({ text }),
      method: 'POST',
    })

    setOutput(response.status === 200 ? await response.json() : {})

    if (response.ok && output?.status === 200) {
      setText('')
    }
  }

  return (
    <main className="container max-w-3xl mx-auto p-4">
      {signedIn ? (
        <div>
          <h1 className="text-3xl text-center font-bold my-4">
            Xでログインしています
          </h1>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="今何してる？"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <Button onClick={postTweet} className="mt-0">
              Post!
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl text-center font-bold my-4">
            ログインしていません
          </h1>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                location.href = authURL
              }}
            >
              ツイッターでログインする
            </Button>
          </div>
        </div>
      )}
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </main>
  )
}

// eDVBZUh0aTNTNFdmdDhsRFVYMngtbmRtZnA1R2VEeFVzbFZ3M1Q0am5udC16OjE3MzYxMDI5NjcwNTQ6MToxOmF0OjE
