import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import Cookies from 'js-cookie'

function get(name: string) {
  if (typeof window == 'undefined') {
    return cookies().get(name)?.value
  } else {
    return Cookies.get(name)
  }
}

function getAll(name: string = '') {
  if (typeof window == 'undefined') {
    return cookies().getAll()
  } else {
    throw 'this function can not work client side'
  }
}

function set(name: string, value: string, options: any | undefined) {
  if (typeof window == 'undefined') {
    cookies().set(name, value, options || { secure: true })
  } else {
    Cookies.set(name, value, options || { secure: true })
  }
}

function remove(name: string) {
  if (typeof window == 'undefined') {
    cookies().delete(name)
  } else {
    Cookies.remove(name)
  }
}

export default { get, getAll, set, remove }
