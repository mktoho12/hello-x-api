import { getSession } from '@/lib/utils'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession(await cookies())

    if (session.accessToken === undefined) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await getUsersMeAPI(session.accessToken)
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

  async function getUsersMeAPI(accessToken: string) {
    const userFields = [
      'created_at',
      'description',
      'entities',
      'id',
      'location',
      'most_recent_tweet_id',
      'name',
      'pinned_tweet_id',
      'profile_image_url',
      'protected',
      'public_metrics',
      'url',
      'username',
      'verified',
      'verified_type',
      'withheld',
    ].join(',')
    const searchParams = new URLSearchParams({ 'user.fields': userFields })
    const url = `https://api.x.com/2/users/me?${searchParams.toString()}`
    const twitterAPIRequest: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Twitter Client by mktoho',
      },
    }

    return await fetch(url, twitterAPIRequest)
  }
}
