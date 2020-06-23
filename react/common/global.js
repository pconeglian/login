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
export const getRootPath = () =>
  (window && window.__RUNTIME__ && window.__RUNTIME__.rootPath) || ''
