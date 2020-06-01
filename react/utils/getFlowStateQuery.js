const getFlowStateQuery = () => {
  const search = window && window.location && window.location.search
  if (!search || !URLSearchParams) {
    return null
  }
  return new URLSearchParams(search).get('flowState')
}

export default getFlowStateQuery
