const getProfileFromQueryResponse = data => {
  if (!data || !data.getProfile || !data.getProfile.profile) return null

  const { email, firstName } = data.getProfile.profile
  if (!email) {
    return null
  }

  return {
    email,
    firstName,
  }
}

const getProfileFromApiResponse = data => {
  const { namespaces } = data || {}
  const { profile } = namespaces || {}
  if (!profile) {
    return null
  }

  const {
    email: { value: email } = { value: null },
    firstName: { value: firstName } = { value: null },
    isAuthenticated: { value: isAuthenticatedValue } = { value: false },
  } = profile

  const isAuthenticated = isAuthenticatedValue === 'true'

  if (isAuthenticated && !email) {
    return null
  }

  return {
    email,
    firstName,
    isAuthenticated,
  }
}

export const getProfile = data => {
  if (!data) return null

  if (data.getSession) return getProfileFromQueryResponse(data)

  if (data.namespaces) return getProfileFromApiResponse(data)

  return null
}
