import React, { useEffect, useCallback, useRef, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useRuntime, Helmet } from 'vtex.render-runtime'
import { AuthStateLazy, useStartLoginAttempt } from 'vtex.react-vtexid'

import {
  GoogleOneTapAlignment,
  SELF_APP_NAME_AND_VERSION,
} from '../common/global'
import getSessionProfile from '../utils/getSessionProfile'

const onLoginPage = current => current === 'store.login'

const isBrowserSupported = () => {
  if (!window || !window.navigator || !window.navigator.userAgent) return false

  const { userAgent: ua } = window.navigator
  return ua.indexOf('Chrome') >= 0 || ua.indexOf('Firefox') >= 0
}

const getWindowHasGoogleScript = () =>
  window && window.google && window.google.accounts && window.google.accounts.id

const OneTapSignin = ({
  shouldOpen,
  page,
  marginTop = '3rem',
  alignment = GoogleOneTapAlignment.RIGHT,
}) => {
  const formRef = useRef()
  const { account, rootPath } = useRuntime()

  const [startSession] = useStartLoginAttempt({
    scope: 'STORE',
    parentAppId: SELF_APP_NAME_AND_VERSION,
    loginAttempt: {
      returnUrl: onLoginPage(page) ? rootPath || '/' : window.location.href,
    },
  })

  const prompt = useCallback(clientId => {
    google.accounts.id.initialize({
      client_id: clientId,
      auto_select:
        onLoginPage(page) &&
        window.localStorage &&
        localStorage.gsi_auto === 'true',
      prompt_parent_id: 'gsi_container',
      cancel_on_tap_outside: false,
      callback: ({ credential }) => {
        if (window.localStorage) localStorage.setItem('gsi_auto', 'true')
        const form = formRef.current
        form.method = 'POST'
        form.action = new URL(
          '/api/vtexid/google/onetap/signin',
          window.location.href
        )
        form.credential.value = credential
        form.submit()
      },
    })
    google.accounts.id.prompt()
  }, [])

  useEffect(() => {
    if (!shouldOpen) return

    getSessionProfile().then(async sessionProfile => {
      const { isAuthenticated } = sessionProfile || {}

      if (isAuthenticated) return

      const { href: baseUrl } = window.location
      const resp = await fetch(
        new URL('/api/vtexid/google/onetap/id', baseUrl).href
      )
      const googleClientId = await resp.json()
      const { clientId } = googleClientId || {}
      if (!clientId) return

      startSession()

      if (getWindowHasGoogleScript()) {
        prompt(clientId)
      } else {
        window.onGoogleLibraryLoad = () => {
          prompt(clientId)
        }
      }
    })
    return () => {
      if (!getWindowHasGoogleScript()) return
      google.accounts.id.cancel()
    }
  }, [account, prompt, shouldOpen, startSession])

  return shouldOpen ? (
    <>
      {!getWindowHasGoogleScript() && (
        <Helmet>
          <script src="https://accounts.google.com/gsi/client" />
        </Helmet>
      )}
      <div
        id="gsi_container z-999 fixed"
        style={{
          top: marginTop,
          ...(alignment === GoogleOneTapAlignment.LEFT
            ? { left: '1rem' }
            : { right: '1rem' }),
        }}
      />
      <form className="dn" ref={formRef}>
        <input name="account" value={account} readOnly />
        <input name="credential" />
      </form>
    </>
  ) : null
}

OneTapSignin.propTypes = {
  shouldOpen: PropTypes.bool.isRequired,
  marginTop: PropTypes.string,
  alignment: PropTypes.string,
}

const Wrapper = props => {
  const { page } = useRuntime()

  if (!isBrowserSupported() || !window.location) return null

  return (
    <Suspense fallback={null}>
      <AuthStateLazy skip scope="STORE" parentAppId={SELF_APP_NAME_AND_VERSION}>
        <OneTapSignin {...props} page={page} />
      </AuthStateLazy>
    </Suspense>
  )
}

export default Wrapper

export const OneTapSignOut = () => {
  if (!window) {
    return
  }
  if (window.localStorage) {
    localStorage.setItem('gsi_auto', 'false')
  }
  if (getWindowHasGoogleScript()) {
    google.accounts.id.disableAutoSelect()
  }
}
