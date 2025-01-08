'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  deleteSession,
  generateCodeChallenge,
  getUsersMeAPI,
  isSignedIn,
  postTweetsAPI,
} from './actions'
import { refreshOAuth2AccessToken } from './callback/actions'

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

  useEffect(() => {
    const prepareSignIn = async () => {
      const signedIn = await isSignedIn()
      setSignedIn(signedIn)
    }

    prepareSignIn()
  }, [])

  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    ;(async function () {
      if (!signedIn) {
        const { codeChallenge, state } = await generateCodeChallenge()
        setCodeChallenge(codeChallenge)
        setState(state)
        sessionStorage.setItem('state', state)
      } else {
        await refreshOAuth2AccessToken()
        const { status, headers, body } = await getUsersMeAPI()
        setOutput({ status, headers, body })
        const { id, username, name, profile_image_url } = body.data
        setUser({
          id,
          username,
          name,
          profile_image_url,
        })
      }
    })()
  }, [signedIn])

  interface User {
    id: string
    username: string
    name: string
    profile_image_url: string
  }
  const [user, setUser] = useState<User>()

  const [text, setText] = useState('')
  const postTweet = async () => {
    const { status, headers, body } = await postTweetsAPI(text)
    setOutput(status === 201 ? { status, headers, body } : {})

    if (status === 201) {
      setText('')
    }
  }

  async function logout() {
    sessionStorage.clear()
    await deleteSession()
    setSignedIn(false)
    setUser(undefined)
    setOutput(undefined)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <main className="container max-w-3xl mx-auto p-4 h-full flex-grow">
        {signedIn ? (
          <div>
            <h1 className="text-3xl text-center font-bold my-4">
              Xでログインしています
            </h1>
            {user && (
              <div className="flex items-center justify-center space-x-4 my-4">
                <Image
                  src={user.profile_image_url}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p>{user.name}</p>
                  <p>
                    <a
                      href={`https://x.com/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{user.username}
                    </a>
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <Input
                placeholder="今何してる？"
                value={text}
                onChange={e => setText(e.target.value)}
                className="h-32"
              />
              <Button onClick={postTweet} className="mt-0">
                Post!
              </Button>
            </div>
            <div className="w-full justify-end my-4">
              <Button onClick={() => logout()}>Logout</Button>
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
        {output && (
          <>
            <h2 className="text-xl text-center font-bold mt-8 my-4">
              デバッグ
            </h2>
            <pre className="my-4 max-h-64 overflow-auto border border-gray-300 p-2">
              {JSON.stringify(output, null, 2)}
            </pre>
          </>
        )}
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
