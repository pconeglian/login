import React, { Fragment, Suspense } from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import {
  useRuntime,
  ExtensionPoint,
  useChildBlock,
} from 'vtex.render-runtime'
import { IconProfile } from 'vtex.store-icons'
import Overlay from 'vtex.react-portal/Overlay'
import { ButtonWithIcon } from 'vtex.styleguide'
import { useResponsiveValue } from 'vtex.responsive-values'

import { truncateString } from '../utils/format-string'
import { LoginPropTypes } from '../propTypes'

import styles from '../styles.css'
import Loading from './Loading'
import Popover from './Popover'
import OutsideClickHandler from './OutsideClickHandler'

const LoginContent = React.lazy(() => import('./LoginContent'))

const ProfileIcon = ({ iconSize, labelClasses, classes }) => {
  const hasIconBlock = Boolean(useChildBlock({ id: 'icon-profile' }))

  if (hasIconBlock) {
    return (
      <div className={classNames(labelClasses, classes)}>
        <ExtensionPoint id="icon-profile" size={iconSize} />
      </div>
    )
  }

  return (
    <div className={classNames(labelClasses, classes)}>
      <IconProfile size={iconSize} />
    </div>
  )
}

const defaultShowIconProfile = { "desktop": false, "mobile": true }

const LoginIcon = ({
  iconSize,
  iconLabel: iconLabelProfile,
  labelClasses,
  loginButtonAsLink,
  onProfileIconClick,
  sessionProfile,
  showIconProfile = defaultShowIconProfile,
}) => {
  const { history, navigate } = useRuntime()
  const { formatMessage } = useIntl()
  const iconProfile = useResponsiveValue(showIconProfile)

  const pathname = history && history.location && history.location.pathname

  const iconClasses = 'flex items-center'
  const iconLabel = iconLabelProfile || formatMessage({ id: 'store/login.signIn' })
  const buttonContent = (
    <Fragment>
      {sessionProfile ? (
        <span
          className={`${styles.profile} t-action--small order-1 ${iconProfile ? 'pl4' : ''} ${labelClasses} dn db-l`}
        >
          {formatMessage({ id: 'store/login.hello' })}{' '}
          {sessionProfile.firstName || truncateString(sessionProfile.email)}
        </span>
      ) : (
        iconLabel && (
          <span
            className={`${styles.label} t-action--small ${iconProfile ? 'pl4 dn db-l' : ''} ${labelClasses}`}
          >
            {iconLabel}
          </span>
        )
      )}
    </Fragment>
  )

  if (loginButtonAsLink) {
    const linkTo = sessionProfile ? 'store.account' : 'store.login'
    const returnUrl =
      !sessionProfile && `returnUrl=${encodeURIComponent(pathname)}`
    return (
      <div className={styles.buttonLink}>
        <ButtonWithIcon
          variation="tertiary"
          icon={
            iconProfile && (
              <ProfileIcon iconSize={iconSize} labelClasses={labelClasses} iconClasses={iconClasses} />
            )
          }
          iconPosition={iconProfile ? 'left' : 'right'}
          onClick={() => navigate({ page: linkTo, query: returnUrl })}
        >
          {buttonContent}
        </ButtonWithIcon>
      </div>
    )
  }

  return (
    <ButtonWithIcon
      variation="tertiary"
      icon={
        iconProfile && (
          <ProfileIcon iconSize={iconSize} labelClasses={labelClasses} />
        )
      }
      iconPosition={iconProfile ? 'left' : 'right'}
      onClick={onProfileIconClick}
    >
      <div className="flex pv2 items-center">
        {buttonContent}
      </div>
    </ButtonWithIcon>
  )
}

/** Function called after login success */
const handleClickLoginButton = () => {
  window.location.reload()
}

const LoginComponent = (props) => {
  const {
    isBoxOpen,
    onOutSideBoxClick,
    sessionProfile,
    mirrorTooltipToRight,
  } = props

  return (
    <div className={`${styles.container} flex items-center fr`}>
      <div className="relative">
        <LoginIcon {...props} />
        {isBoxOpen && (
          <Overlay>
            <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
              <Popover mirrorTooltipToRight={mirrorTooltipToRight}>
                <Suspense fallback={<Loading />}>
                  <LoginContent
                    profile={sessionProfile}
                    loginCallback={handleClickLoginButton}
                    isInitialScreenOptionOnly
                    {...props}
                  />
                </Suspense>
              </Popover>
            </OutsideClickHandler>
          </Overlay>
        )}
      </div>
    </div>
  )
}

LoginComponent.propTypes = LoginPropTypes

export default LoginComponent
