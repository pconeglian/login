const getErrorQuery = runtime => {
  return runtime && runtime.query && runtime.query.error
}

export default getErrorQuery
