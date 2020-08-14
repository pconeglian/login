import { useState, useCallback, useEffect } from 'react'

const useAsyncCallback = (callback, depsLst, { autorun = false } = {}) => {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(autorun)

  const memoizedCallback = useCallback(callback, depsLst)

  const wrappedCallback = useCallback(
    async (...args) => {
      setLoading(true)

      const newValue = await memoizedCallback(...args)
      setValue(newValue)
      setLoading(false)
      return newValue
    },
    [memoizedCallback]
  )

  useEffect(() => {
    if (autorun) {
      wrappedCallback()
    }
  }, [autorun, wrappedCallback])

  return [wrappedCallback, { value, loading }]
}

export default useAsyncCallback
