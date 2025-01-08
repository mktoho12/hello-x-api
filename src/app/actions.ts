'use server'

import { getSession } from '@/lib/utils'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'

export async function isSignedIn() {
  const session = await getSession(await cookies())

  return session.accessToken != null
}

export async function generateCodeChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString('hex')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  const state = nanoid()

  const session = await getSession(await cookies())
  session.codeVerifier = codeVerifier
  session.state = state
  await session.save()

  return { codeChallenge, state }
}

export async function getUsersMeAPI() {
  const { accessToken } = await getSession(await cookies())

  if (!accessToken) {
    throw new Error('Unauthorized')
  }

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

  const response = await fetch(url, twitterAPIRequest)

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.json(),
  }
}

export async function postTweetsAPI(text: string) {
  const { accessToken } = await getSession(await cookies())

  if (!accessToken) {
    throw new Error('Unauthorized')
  }

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

  const response = await fetch(url, twitterAPIRequest)

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.json(),
  }
}

export async function deleteSession() {
  const session = await getSession(await cookies())
  session.destroy()
}
