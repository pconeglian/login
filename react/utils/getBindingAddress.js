const getBindingAddress = () => {
  const search = window && window.location && window.location.search
  const searchParams = new URLSearchParams(search)
  return searchParams.get('__bindingAddress')
}

export default getBindingAddress
