'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect } from 'react'

export default function PublicCallbackPage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <PublicCallback />
    </Suspense>
  )
}

function PublicCallback() {
  const { state, code } = Object.fromEntries(useSearchParams().entries())
  const postToken = useCallback(_postToken, [])
  const router = useRouter()

  useEffect(() => {
    if (state && code) {
      postToken({
        clientId: process.env.NEXT_PUBLIC_X_CLIENT_ID,
        code,
      }).then(() => {
        router.push('/public')
      })
    }
  }, [code, postToken, router, state])

  return <p>aaa</p>

  interface PostOAuthTokenProps {
    clientId: string
    code: string
  }

  async function _postToken({ clientId, code }: PostOAuthTokenProps) {
    const url = '/api/callback'
    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Twitter Client by mktoho',
      },
      body: JSON.stringify({ clientId, code }),
    }

    const response = await fetch(url, request)

    return await response.json()
  }
}
