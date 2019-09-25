import React, { Component } from 'react'

import { path, toLower } from 'ramda'
import { withSession } from 'vtex.render-runtime'
import { injectIntl } from 'react-intl'

import { LoginSchema } from './schema'
import { setCookie } from './utils/set-cookie'
import { session } from 'vtex.store-resources/Queries'
import { LoginContainerProptypes } from './propTypes'
import LoginComponent from './components/LoginComponent'

const DEFAULT_CLASSES = 'gray'

const convertToBool = str => !!str && toLower(str) === 'true'

/** Canonical login that calls a mutation to retrieve the authentication token */

export default class Login extends Component {
  static propTypes = LoginContainerProptypes

  static defaultProps = {
    labelClasses: DEFAULT_CLASSES,
  }

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
    sessionProfile: null,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    window.__RENDER_8_SESSION__.sessionPromise.then(data => {
      const sessionRespose = data.response

      if (!sessionRespose || !sessionRespose.namespaces) {
        return
      }

      const { namespaces } = sessionRespose
      const storeUserId = path(
        ['authentication', 'storeUserId', 'value'],
        namespaces
      )
      if (!storeUserId) {
        return
      }

      const profile = {
        document: path(['document', 'value'], namespaces.profile),
        email:
          path(['email', 'value'], namespaces.profile) ||
          path(['storeUserEmail', 'value'], namespaces.authentication),
        firstName: path(['firstName', 'value'], namespaces.profile),
        id: path(['id', 'value'], namespaces.profile),
        isAuthenticatedAsCustomer: convertToBool(
          path(['isAuthenticated', 'value'], namespaces.profile)
        ),
        lastName: path(['lastName', 'value'], namespaces.profile),
        phone: path(['phone', 'value'], namespaces.profile),
      }
      this.setState({ sessionProfile: profile })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const WIDTH_THRESHOLD = 640

    if (window.innerWidth < WIDTH_THRESHOLD && !this.state.renderIconAsLink) {
      this.setState({
        renderIconAsLink: true,
      })
    } else if (
      window.innerWidth >= WIDTH_THRESHOLD &&
      this.state.renderIconAsLink
    ) {
      this.setState({
        renderIconAsLink: false,
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
    return (
      <LoginWithSession
        isBoxOpen={this.state.isBoxOpen}
        renderIconAsLink={this.state.renderIconAsLink}
        sessionProfile={this.state.sessionProfile}
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
})

const LoginWithSession = withSession({
  loading: <div />,
})(injectIntl(LoginComponent))
