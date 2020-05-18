import { getProfile } from './profile'

const getSessionPromiseFromWindow = () =>
  window &&
  window.__RENDER_8_SESSION__ &&
  window.__RENDER_8_SESSION__.sessionPromise
    ? window.__RENDER_8_SESSION__.sessionPromise
    : Promise.resolve(null)

const getSessionProfile = async () => {
  const data = await getSessionPromiseFromWindow()
  const sessionResponse = (data || {}).response
  return getProfile(sessionResponse)
}

export default getSessionProfile
