import { sessionOptions } from '@/lib/utils'
import { Session } from '@/types/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    const session = await getIronSession<Session>(
      await cookies(),
      sessionOptions
    )

    if (session.accessToken === undefined) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetchPostTweetAPI(session.accessToken, text)
    return NextResponse.json({
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.json(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }

  async function fetchPostTweetAPI(accessToken: string, text: string) {
    const url = 'https://api.x.com/2/tweets'
    const twitterAPIRequest: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Twitter Client by mktoho',
      },
      body: JSON.stringify({ text }),
    }

    return await fetch(url, twitterAPIRequest)
  }
}
