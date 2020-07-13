import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import { AuthServiceLazy } from 'vtex.react-vtexid'
import { useCssHandles } from 'vtex.css-handles'

import { translate } from '../utils/translate'
import styles from '../styles.css'
import { OneTapSignOut } from './OneTapSignin'

// Component that shows account options to the user.
const AccountOptions = ({ intl, optionLinks }) => {
  const hasOptionLinks = useMemo(() => optionLinks && optionLinks.length > 0, [
    optionLinks,
  ])

  const cssClasses = useMemo(() => {
    return (optionLinks || [])
      .map(({ cssClass }) => cssClass)
      .filter(cssClass => cssClass)
  }, [optionLinks])

  const handles = useCssHandles(cssClasses)

  return (
    <div className={`${styles.accountOptions} items-center w-100`}>
      <div className="mv4 min-h-2 b--muted-4">
        {hasOptionLinks ? (
          <>
            <div
              className={`${styles.accountOptionsSectionTitle} t-small b mb3`}
            >
              {translate('store/login.myAccount', intl)}
            </div>
            {optionLinks.map(({ label, path, cssClass }, inx) => (
              <a
                className={`${handles[cssClass] ||
                  ''} db no-underline t-small c-muted-1 hover-c-action-primary pv3`}
                href={new URL(path || '/', window.location.href).href}
                key={inx}
              >
                {label}
              </a>
            ))}
          </>
        ) : (
          <Link page="store.account">
            <button
              className={`${styles.button} bw1 ba ttu br2 t-action--small v-mid relative pv3 ph5 t-heading-5 bg-base b--transparent c-action-primary  hover-c-action-primary pointer`}
              closeonclick=""
            >
              <span className="t-action--small">
                {translate('store/login.myAccount', intl)}
              </span>
            </button>
          </Link>
        )}
      </div>
      <hr className="mv2 o-30" />
      <div className="mv4 min-h-2 b--muted-4">
        <AuthServiceLazy.RedirectLogout>
          {({ action: logout }) => {
            if (hasOptionLinks) {
              return (
                <button
                  className={`${styles.logoutButton} t-small bn pa0 c-muted-1 hover-c-danger bg-transparent pointer`}
                  onClick={() => {
                    OneTapSignOut()
                    logout()
                  }}
                >
                  {translate('store/login.logoutLabel', intl)}
                </button>
              )
            }
            return (
              <Button
                variation="tertiary"
                size="small"
                onClick={() => {
                  OneTapSignOut()
                  logout()
                }}
              >
                <span className="t-action--small">
                  {translate('store/login.logoutLabel', intl)}
                </span>
              </Button>
            )
          }}
        </AuthServiceLazy.RedirectLogout>
      </div>
    </div>
  )
}

AccountOptions.propTypes = {
  /** Intl object */
  intl: intlShape,
  optionLinks: PropTypes.array,
}

export default injectIntl(AccountOptions)
