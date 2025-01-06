import { sessionOptions } from '@/lib/utils'
import { Session } from '@/types/session'
import crypto from 'crypto'
import { getIronSession } from 'iron-session'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getIronSession<Session>(
      await cookies(),
      sessionOptions
    )

    const signature: { codeChallenge?: string; state?: string } = {}
    if (!session.accessToken) {
      const codeVerifier = crypto.randomBytes(32).toString('hex')

      const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
      signature.codeChallenge = codeChallenge
      signature.state = nanoid()

      session.codeVerifier = codeVerifier
      session.state = signature.state
      await session.save()
    }
    return NextResponse.json({ signed_in: !!session.accessToken, ...signature })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }
}
