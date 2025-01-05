import { sessionOptions } from '@/lib/utils'
import { Session } from '@/types/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getIronSession<Session>(
      await cookies(),
      sessionOptions
    )

    return NextResponse.json({ signed_in: !!session.accessToken })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }
}
