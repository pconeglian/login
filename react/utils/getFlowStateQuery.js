const getFlowStateQuery = () => {
  if (window && window.location && window.location.search) {
    return new URLSearchParams(window.location.search).get('flowState')
  }
  return null
}

export default getFlowStateQuery
