const getUserEmailQuery = () => {
  const search = window && window.location && window.location.search
  if (!search || !URLSearchParams) {
    return null
  }
  return new URLSearchParams(search).get('userEmail')
}

export default getUserEmailQuery
