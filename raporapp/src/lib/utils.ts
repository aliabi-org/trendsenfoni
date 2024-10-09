import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function moneyFormat(x?: number) {
  if (!x) {
    x = 0
  }
  x = Math.round(100 * x) / 100

  return x.toLocaleString("en-US") + (x - Math.floor(x) == 0 ? '.00' : '')
  // return x.toLocaleString() + (x - Math.floor(x) == 0 ? '.00' : '')


}
