import { ROOT_PATH } from '../common/global'
import composeQueryString from './composeQueryString'
import getBindingAddress from './getBindingAddress'

export const getReturnUrl = () => {
  if (!window || !window.location) {
    return null
  }
  return new URLSearchParams(window.location.search).get('returnUrl')
}

export const getDefaultRedirectUrl = isHeaderLogin => {
  if (!window || !window.location) {
    return null
  }
  if (isHeaderLogin) {
    return `${window.location.pathname}${window.location.search}`
  }
  return null
}

export const jsRedirect = ({ runtime, isHeaderLogin }) => {
  const url =
    getReturnUrl() ||
    getDefaultRedirectUrl(isHeaderLogin) ||
    `${ROOT_PATH}/?${composeQueryString({
      __bindingAddress: getBindingAddress(),
    })}`

  if (!url) {
    return
  }

  runtime.navigate({
    to: url,
    fallbackToWindowLocation: true,
  })
}
