import { sessionOptions } from '@/lib/utils'
import { Session } from '@/types/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const output: { [key: string]: object }[] = []

  try {
    const { code, clientId } = await request.json()

    const accessToken = await postOauth2Token({
      code,
      redirectURI: process.env.NEXT_PUBLIC_X_REDIRECT_URI,
      clientId,
      codeVerifier: 'challenge',
    })

    const session = await getIronSession<Session>(
      await cookies(),
      sessionOptions
    )
    session.accessToken = accessToken
    await session.save()
    // await fetchPostTweetAPI(accessToken, 'テストテスト')

    return NextResponse.json(output)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }

  interface PostOAuthTokenProps {
    code: string
    redirectURI: string
    clientId: string
    codeVerifier: string
  }
  async function postOauth2Token({
    code,
    redirectURI,
    clientId,
    codeVerifier,
  }: PostOAuthTokenProps) {
    const url = 'https://api.x.com/2/oauth2/token'
    const requestBody = {
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectURI,
      client_id: clientId,
      code_verifier: codeVerifier,
    }
    const twitterAPIRequest: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Twitter Client by mktoho',
      },
      body: new URLSearchParams(requestBody).toString(),
    }

    const response = await fetch(url, twitterAPIRequest)

    if (!response.ok) {
      console.error(response)
      throw new Error('Twitter API Error')
    }

    const twitterAPIResponse = {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.json(),
    }

    output.push({
      request: { url, ...twitterAPIRequest },
      response: twitterAPIResponse,
    })

    return twitterAPIResponse.body.access_token
  }
}
