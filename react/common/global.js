export const USER_IDENTIFIER_INTERFACE_ID = 'user-identifier'
export const SELF_APP_NAME_AND_VERSION =
  process.env.VTEX_APP_ID || process.env.VTEX_APP_NAME || null
export const ButtonBehavior = {
  POPOVER: 'popover',
  LINK: 'link',
}
export const GoogleOneTapAlignment = {
  RIGHT: 'Right',
  LEFT: 'Left',
}
export const ROOT_PATH =
  (window && window.__RUNTIME__ && window.__RUNTIME__.rootPath) || ''
const search = window && window.location && window.location.search
const searchParams = new URLSearchParams(search)
export const BINDING_ADDRESS = searchParams.get('__bindingAddress')
