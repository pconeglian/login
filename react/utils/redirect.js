import { ROOT_PATH } from '../common/global'
import getBindingAddress from './getBindingAddress'

export const getReturnUrl = () => {
  const search = window && window.location && window.location.search
  if (!search || !URLSearchParams) {
    return null
  }
  return new URLSearchParams(search).get('returnUrl')
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
  const url = getReturnUrl() || getDefaultRedirectUrl(isHeaderLogin)

  if (!url) {
    const __bindingAddress = getBindingAddress()
    const queryString = __bindingAddress
      ? new URLSearchParams({ __bindingAddress }).toString()
      : ''
    return `${ROOT_PATH}/?${queryString}`
  }

  runtime.navigate({
    to: url,
    fallbackToWindowLocation: true,
  })
}
