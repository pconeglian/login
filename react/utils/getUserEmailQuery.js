const getUserEmailQuery = () => {
  if (window && window.location && window.location.search) {
    return new URLSearchParams(window.location.search).get('userEmail')
  }
  return null
}

export default getUserEmailQuery
