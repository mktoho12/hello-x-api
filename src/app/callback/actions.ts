'use server'

import { getSession } from '@/lib/utils'
import { cookies } from 'next/headers'

interface Props {
  code: string
  state: string
}

export async function postOAuth2AccessToken({ code, state }: Props) {
  const session = await getSession(await cookies())
  const { codeVerifier, state: storedState } = session

  if (!codeVerifier) {
    throw new Error('Invalid session')
  }

  if (!storedState || state !== storedState) {
    throw new Error(
      `CSRF Attack!! state: ${state}, storedState: ${storedState}`
    )
  }

  const url = 'https://api.x.com/2/oauth2/token'
  const requestBody = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.NEXT_PUBLIC_X_REDIRECT_URI,
    client_id: process.env.NEXT_PUBLIC_X_CLIENT_ID,
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

  const body = await response.json()

  session.accessToken = body.access_token
  session.refreshToken = body.refresh_token
  await session.save()

  return
}

export async function refreshOAuth2AccessToken() {
  const session = await getSession(await cookies())
  const { refreshToken } = session

  if (!refreshToken) {
    throw new Error('Invalid session')
  }

  const url = 'https://api.x.com/2/oauth2/token'
  const requestBody = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.NEXT_PUBLIC_X_CLIENT_ID,
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

  const body = await response.json()

  session.accessToken = body.access_token
  session.refreshToken = body.refresh_token
  await session.save()

  return
}
