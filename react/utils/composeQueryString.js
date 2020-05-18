const composeQueryString = queryObj => {
  return Object.keys(queryObj)
    .map(key => `${key}=${encodeURIComponent(queryObj[key] || '')}`)
    .join('&')
}

export default composeQueryString
