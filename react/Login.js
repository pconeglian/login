import React, { Component } from 'react'

import { injectIntl } from 'react-intl'

import { ButtonBehavior, GoogleOneTapAlignment } from './common/global'
import { LoginSchema } from './schema'
import { setCookie } from './utils/set-cookie'
import { LoginContainerProptypes, LoginContainerDefaultProps } from './propTypes'
import LoginComponent from './components/LoginComponent'
import getSessionProfile from './utils/getSessionProfile'

const LoginWithSession = injectIntl(LoginComponent)
/** Canonical login that calls a mutation to retrieve the authentication token */

export default class Login extends Component {
  static propTypes = LoginContainerProptypes

  static defaultProps = LoginContainerDefaultProps

  state = {
    isBoxOpen: false,
    isMobileScreen: false,
    sessionProfile: null,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    getSessionProfile().then(sessionProfile => {
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
    const { sessionProfile, isMobileScreen } = this.state
    const buttonLink = ButtonBehavior.LINK

    const { isAuthenticated } = sessionProfile || {}
    const shouldBeLink = isMobileScreen || (isAuthenticated ? accountOptionsButtonBehavior === buttonLink : logInButtonBehavior === buttonLink)
    
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
    },
    hasGoogleOneTap: {
      title: 'admin/editor.login.googleOneTap.title',
      type: 'boolean',
    },
    hideIconLabel: {
      title: 'admin/editor.login.hideIconLabel',
      type: 'boolean',
      default: false,
    },
  },
  dependencies: {
    ...LoginSchema.dependencies,
    hasGoogleOneTap: {
      oneOf: [
        {
          properties: {
            hasGoogleOneTap: {
              enum: [true],
            },
            googleOneTapAlignment:{
              title: 'admin/editor.login.googleOneTap.alignment',
              type: 'string',
              enum: [GoogleOneTapAlignment.RIGHT, GoogleOneTapAlignment.LEFT],
              default: GoogleOneTapAlignment.RIGHT,
            },
            googleOneTapMarginTop:{
              title: 'admin/editor.login.googleOneTap.marginTop',
              type: 'string',
              default: '3rem',
            },
          },
        },
      ],
    },
  },
})

Login.uiSchema = {
  'ui:order': [
    '*',
    'hasIdentifierExtension',
    'identifierPlaceholder',
    'invalidIdentifierError',
    'accountOptionLinks',
    'hasGoogleOneTap',
    'googleOneTapAlignment',
    'googleOneTapMarginTop',
  ],
}

