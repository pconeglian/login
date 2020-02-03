import React, { Component, Suspense } from 'react'
import LoginContent from './components/LoginContent'
import { NoSSR } from 'vtex.render-runtime'
import Loading from './components/Loading'

const LoginContentWrapper = props => {
  return (
    <NoSSR>
      <Suspense fallback={<Loading />}>
        <LoginContent {...props} />
      </Suspense>
    </NoSSR>
  )
}

export default LoginContentWrapper