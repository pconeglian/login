import React, { Component, Fragment, Suspense } from 'react'
import {
  withRuntimeContext,
  ExtensionPoint,
  useChildBlock,
} from 'vtex.render-runtime'

import classNames from 'classnames'

import { IconProfile } from 'vtex.store-icons'
import Overlay from 'vtex.react-portal/Overlay'
import { ButtonWithIcon } from 'vtex.styleguide'

import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'
import OneTapSignin from './OneTapSignin'
import getBindingAddress from '../utils/getBindingAddress'

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

class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  renderIcon = () => {
    const {
      iconSize,
      iconLabel: iconLabelProfile,
      hideIconLabel,
      labelClasses,
      intl,
      loginButtonAsLink,
      onProfileIconClick,
      sessionProfile,
      showIconProfile,
      runtime: { history, navigate },
    } = this.props

    const pathname = history && history.location && history.location.pathname
    const search = history && history.location && history.location.search

    const iconClasses = `flex items-center ${hideIconLabel ? 'nr4' : ''}`
    const iconLabel = iconLabelProfile || translate('store/login.signIn', intl)

    const buttonContent = hideIconLabel ? (
      <></>
    ) : sessionProfile ? (
      <span
        className={`${styles.profile} truncate t-action--small order-1 pl4 ${labelClasses} dn db-l`}
      >
        {translate('store/login.hello', intl)}{' '}
        {sessionProfile.firstName || sessionProfile.email}
      </span>
    ) : (
      <span
        className={`${styles.label} t-action--small pl4 ${labelClasses} dn db-l`}
      >
        {iconLabel}
      </span>
    )

    if (loginButtonAsLink) {
      const linkTo = sessionProfile ? 'store.account' : 'store.login'
      return (
        <div className={styles.buttonLink}>
          <ButtonWithIcon
            variation="tertiary"
            icon={
              showIconProfile && (
                <ProfileIcon iconSize={iconSize} labelClasses={labelClasses} classes={iconClasses} />
              )
            }
            iconPosition={showIconProfile ? 'left' : 'right'}
            onClick={() => {
              if (!window || !URLSearchParams) {
                return
              }
              const returnUrl =
                !sessionProfile &&
                encodeURIComponent(`${pathname}${search}`)
              const bindingAddress = getBindingAddress()
              return navigate({
              page: linkTo,
              query: new URLSearchParams({
                ...(returnUrl && {
                  returnUrl,
                }),
                ...(bindingAddress && {
                  bindingAddress,
                }),
              }).toString()
            })}}
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
          showIconProfile && (
            <ProfileIcon iconSize={iconSize} labelClasses={labelClasses} classes={iconClasses} />
          )
        }
        iconPosition={showIconProfile ? 'left' : 'right'}
        onClick={onProfileIconClick}
      >
        <div
          className="flex pv2 items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {buttonContent}
        </div>
      </ButtonWithIcon>
    )
  }

  render() {
    const {
      isBoxOpen,
      onOutSideBoxClick,
      sessionProfile,
      mirrorTooltipToRight,
      hasGoogleOneTap,
     googleOneTapAlignment,
     googleOneTapMarginTop,
    } = this.props

    return (
      <div className={`${styles.container} flex items-center fr`}>
        <div className="relative">
          {this.renderIcon()}
          {hasGoogleOneTap && (
            <OneTapSignin
              alignment={googleOneTapAlignment}
              marginTop={googleOneTapMarginTop}
              shouldOpen={!sessionProfile}
            />
          )}
          {isBoxOpen && (
            <Overlay>
              <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
                <Popover mirrorTooltipToRight={mirrorTooltipToRight}>
                  <Suspense fallback={<Loading />}>
                    <LoginContent
                      profile={sessionProfile}
                      isInitialScreenOptionOnly
                      isHeaderLogin
                      {...this.props}
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
}

export default withRuntimeContext(LoginComponent)
