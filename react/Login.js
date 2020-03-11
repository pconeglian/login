import React, { Component } from 'react'

import { withSession } from 'vtex.render-runtime'
import { injectIntl } from 'react-intl'

import { ButtonBehavior } from './common/global'
import { LoginSchema } from './schema'
import { setCookie } from './utils/set-cookie'
import { LoginContainerProptypes } from './propTypes'
import LoginComponent from './components/LoginComponent'
import { getProfile } from './utils/profile'

const DEFAULT_CLASSES = 'gray'

/** Canonical login that calls a mutation to retrieve the authentication token */

export default class Login extends Component {
  static propTypes = LoginContainerProptypes

  static defaultProps = {
    labelClasses: DEFAULT_CLASSES,
    logInButtonBehavior: ButtonBehavior.POPOVER,
  }

  state = {
    isBoxOpen: false,
    isMobileScreen: false,
    sessionProfile: null,
  }

  getSessionPromiseFromWindow = () =>
    !window.__RENDER_8_SESSION__ || !window.__RENDER_8_SESSION__.sessionPromise
      ? Promise.resolve(null)
      : window.__RENDER_8_SESSION__.sessionPromise

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    this.getSessionPromiseFromWindow().then(data => {
      const sessionResponse = (data || {}).response
      const sessionProfile = getProfile(sessionResponse)
      if (sessionProfile) {
        this.setState({ sessionProfile })
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const WIDTH_THRESHOLD = 640

    if (window.innerWidth < WIDTH_THRESHOLD && !this.state.isMobileScreen) {
      this.setState({
        isMobileScreen: true,
      })
    } else if (
      window.innerWidth >= WIDTH_THRESHOLD &&
      this.state.isMobileScreen
    ) {
      this.setState({
        isMobileScreen: false,
      })
    }
  }

  handleProfileIconClick = () => {
    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  handleOutSideBoxClick = () => {
    this.setState({ isBoxOpen: false })
  }

  render() {
    const { logInButtonBehavior, accountOptionsButtonBehavior } = this.props
    const { sessionProfile } = this.state
    const {isMobileScreen} = this.state
    const buttonLink = ButtonBehavior.LINK
    const shouldBeLink = isMobileScreen || (sessionProfile ? accountOptionsButtonBehavior === buttonLink : logInButtonBehavior === buttonLink)
    
    return (
      <LoginWithSession
        isBoxOpen={this.state.isBoxOpen}
        loginButtonAsLink={shouldBeLink}
        sessionProfile={sessionProfile}
        {...this.props}
        onOutSideBoxClick={this.handleOutSideBoxClick}
        onProfileIconClick={this.handleProfileIconClick}
      />
    )
  }
}

Login.getSchema = () => ({
  title: 'admin/editor.login.title',
  ...LoginSchema,
  properties: {
    ...LoginSchema.properties,
    mirrorTooltipToRight: {
      title: 'admin/editor.login.mirrorTooltipToRightTitle',
      type: 'boolean',
      default: false,
    },
    logInButtonBehavior: {
      title: 'admin/editor.login.logInButtonBehavior',
      type: 'string',
      enum: [ButtonBehavior.POPOVER, ButtonBehavior.LINK],
      default: ButtonBehavior.POPOVER,
    },
    accountOptionsButtonBehavior: {
      title: 'admin/editor.login.accountOptionsButtonBehavior',
      type: 'string',
      enum: [ButtonBehavior.POPOVER, ButtonBehavior.LINK],
      default: ButtonBehavior.POPOVER,
    },
    accountOptionLinks: {
      title: 'admin/editor.login.accountOptionLinks',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            title: 'admin/editor.login.accountOptionLabelTitle',
            type: 'string'
          },
          path: {
            title: 'admin/editor.login.accountOptionPathTitle',
            type: 'string'
          },
          cssClass: {
            title: 'admin/editor.login.accountOptionCssClassTitle',
            type: 'string'
          }
        }
      }
    }
  },
})

Login.uiSchema = {
  'ui:order': ['*', 'hasIdentifierExtension', 'identifierPlaceholder', 'invalidIdentifierError', 'accountOptionLinks'],
}

const LoginWithSession = withSession({ renderWhileLoading: true })(injectIntl(LoginComponent))
