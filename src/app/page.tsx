'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Public() {
  const [output, setOutput] = useState<{ [key: string]: object | number }>()
  const [codeChallenge, setCodeChallenge] = useState<string>()
  const [state, setState] = useState<string>()

  const createAuthURL = () => {
    if (!codeChallenge || !state) {
      return null
    }

    const url = 'https://twitter.com/i/oauth2/authorize'
    const searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_X_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_X_REDIRECT_URI,
      scope: 'tweet.read tweet.write users.read offline.access',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
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
          if (data.codeChallenge) {
            setCodeChallenge(data.codeChallenge)
          }
          if (data.state) {
            setState(data.state)
            sessionStorage.setItem('state', data.state)
          }
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
    <div className="min-h-screen flex flex-col justify-center">
      <main className="container max-w-3xl mx-auto p-4 h-full flex-grow">
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
              {authURL && (
                <Button
                  onClick={() => {
                    location.href = authURL
                  }}
                >
                  ツイッターでログインする
                </Button>
              )}
            </div>
          </div>
        )}
        <pre>{JSON.stringify(output, null, 2)}</pre>
      </main>
      <footer>
        <div className="container max-w-3xl mx-auto p-4">
          <p className="text-center text-xl">
            <a
              href="https://github.com/mktoho12/hello-x-api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 justify-center items-center"
            >
              <Image
                src="/github-mark.svg"
                alt="Github"
                width={24}
                height={24}
              />
              Github
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
