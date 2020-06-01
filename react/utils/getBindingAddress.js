const getBindingAddress = () => {
  const search = window && window.location && window.location.search
  if (!search || !URLSearchParams) {
    return null
  }
  return new URLSearchParams(search).get('__bindingAddress')
}

export default getBindingAddress
