'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { postOAuth2AccessToken } from './actions'

export default function PublicCallbackPage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <PublicCallback />
    </Suspense>
  )
}

function PublicCallback() {
  const searchParams = useSearchParams()
  const { state, code } = Object.fromEntries(searchParams.entries())
  const router = useRouter()

  useEffect(() => {
    const postToken = async () => {
      if (state && code) {
        await postOAuth2AccessToken({ code, state })
        router.push('/')
      }
    }

    postToken()
  }, [code, router, state])

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <main className="container max-w-3xl mx-auto p-4 h-full flex-grow">
        <p>ログインしています……</p>
      </main>
    </div>
  )
}
