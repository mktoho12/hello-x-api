import { Session } from '@/types/session'
import { clsx, type ClassValue } from 'clsx'
import { getIronSession } from 'iron-session'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sessionOptions = {
  password: 'b+Wp^Yyq.2$;tQ1+pu<sOp<"A.;c_!oW',
  cookieName: 'session',
}

export async function getSession(cookie: ReadonlyRequestCookies) {
  return getIronSession<Session>(cookie, sessionOptions)
}
