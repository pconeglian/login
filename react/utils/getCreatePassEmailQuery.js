const getCreatePassEmailQuery = () => {
  if (window && window.location && window.location.search) {
    return new URLSearchParams(window.location.search).get('createPassEmail')
  }
  return null
}

export default getCreatePassEmailQuery
