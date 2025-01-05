import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sessionOptions = {
  password: 'b+Wp^Yyq.2$;tQ1+pu<sOp<"A.;c_!oW',
  cookieName: 'session',
}
