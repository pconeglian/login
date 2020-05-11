import React, { Component, Suspense, useMemo } from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import Markdown from 'react-markdown'

import Loading from './Loading'
import LoginOptions from './LoginOptions'
import AccountOptions from './AccountOptions'
import EmailAndPassword from './EmailAndPassword'
import CodeConfirmation from './CodeConfirmation'
import RecoveryPassword from './RecoveryPassword'
import EmailVerification from './EmailVerification'
import OAuthAutoRedirect from './OAuthAutoRedirect'

import { steps } from '../utils/steps'
import { setCookie } from '../utils/set-cookie'
import FlowState from '../utils/FlowState'

import { LoginPropTypes } from '../propTypes'
import { AuthStateLazy, serviceHooks } from 'vtex.react-vtexid'
import { SELF_APP_NAME_AND_VERSION } from '../common/global'
import getUserEmailQuery from '../utils/getUserEmailQuery'
import getFlowStateQuery from '../utils/getFlowStateQuery'
import getSessionProfile from '../utils/getSessionProfile'

import styles from '../styles.css'

const STEPS = [
  /* eslint-disable react/display-name, react/prop-types */
  ({ props, state, handleStateChange, isOptionsMenuDisplayed }) => {
    return style => (
      <div style={style} key={0}>
        <EmailVerification
          next={steps.CODE_CONFIRMATION}
          previous={steps.LOGIN_OPTIONS}
          isCreatePassword={state.isCreatePassword}
          title={props.accessCodeTitle}
          emailPlaceholder={props.emailPlaceholder}
          onStateChange={handleStateChange}
          showBackButton={!isOptionsMenuDisplayed}
        />
      </div>
    )
  },
  ({ props, handleStateChange, isOptionsMenuDisplayed, handleLoginSuccess }) => {
    return style => (
      <div style={style} key={1}>
        <EmailAndPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.LOGIN_OPTIONS}
          title={props.emailAndPasswordTitle}
          emailPlaceholder={props.emailPlaceholder}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={
            props.showPasswordVerificationIntoTooltip
          }
          onStateChange={handleStateChange}
          showBackButton={!isOptionsMenuDisplayed}
          onLoginSuccess={handleLoginSuccess}
          identifierPlaceholder={props.hasIdentifierExtension ? props.identifierPlaceholder : ''}
          invalidIdentifierError={props.hasIdentifierExtension ? props.invalidIdentifierError : ''}
        />
      </div>
    )
  },
  ({ props, handleStateChange, handleLoginSuccess }) => {
    return style => (
      <div style={style} key={2}>
        <CodeConfirmation
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_VERIFICATION}
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={handleStateChange}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  },
  ({ props }) => {
    return style => (
      <div style={style} key={3}>
        <AccountOptions optionLinks={props.accountOptionLinks} />
      </div>
    )
  },
  ({ props, handleStateChange, handleLoginSuccess }) => {
    return style => (
      <div style={style} key={4}>
        <RecoveryPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_PASSWORD}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={
            props.showPasswordVerificationIntoTooltip
          }
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={handleStateChange}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  },
  /* eslint-enable react/display-name react/prop-types */
]

class LoginContent extends Component {
  static propTypes = {
    /** Whether this is rendered by the header component (LoginComponent) */
    isHeaderLogin: PropTypes.bool,
    /** User profile information */
    profile: PropTypes.shape({}),
    /** Which screen option will renderize  */
    isInitialScreenOptionOnly: PropTypes.bool,
    /** Step that will be render first */
    defaultOption: PropTypes.number,
    /** Runtime context. */
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
      page: PropTypes.string,
      history: PropTypes.shape({
        location: PropTypes.shape({
          pathname: PropTypes.string,
          search: PropTypes.string,
        }),
      }),
    }),
    /* Reused props */
    optionsTitle: LoginPropTypes.optionsTitle,
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip:
      LoginPropTypes.showPasswordVerificationIntoTooltip,
    providerPasswordButtonLabel: PropTypes.string,
    hasIdentifierExtension: PropTypes.bool,
    identifierPlaceholder: PropTypes.string,
    invalidIdentifierError: PropTypes.string,
    /** Terms and conditions text in markdown */
    termsAndConditions: PropTypes.string,
    returnUrl: PropTypes.string,
    defaultIsCreatePassword: PropTypes.bool,
    redirectAfterLogin: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isInitialScreenOptionOnly: true,
    defaultOption: 0,
    optionsTitle: '',
  }

  static contextTypes = {
    patchSession: PropTypes.func,
  }

  state = {
    sessionProfile: this.props.profile,
    isOnInitialScreen: !this.props.profile,
    isCreatePassword: this.props.defaultIsCreatePassword,
    step: this.props.defaultOption,
    email: '',
    password: '',
    code: '',
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    getSessionProfile().then(sessionProfile => {
      if (sessionProfile) {
        this.setState({ sessionProfile })
      }
    })
  }

  get shouldRenderLoginOptions() {
    return this.props.isInitialScreenOptionOnly
      ? this.state.isOnInitialScreen
      : true
  }

  get shouldRenderForm() {
    if (this.props.profile) {
      return true
    }

    return (
      !this.props.isInitialScreenOptionOnly || !this.state.isOnInitialScreen
    )
  }

  shouldRedirectToOAuth = loginOptions => {
    if (!loginOptions) return [false, null]
    const { accessKey, oAuthProviders, password } = loginOptions
    const { runtime } = this.props
    if (runtime && runtime.query && runtime.query.oAuthRedirect) {
      const redirectProvider =
        oAuthProviders &&
        oAuthProviders.find(provider => provider.providerName === runtime.query.oAuthRedirect)
      if (redirectProvider) {
        return [true, redirectProvider]
      }
    }
    if (accessKey || password) return [false, null]
    if (!oAuthProviders || oAuthProviders.length !== 1) return [false, null]
    return [true, oAuthProviders[0]]
  }

  handleStateChange = state => {
    if (state.hasOwnProperty('step')) {
      if (state.step === -1) {
        state.step = 0
        state.isOnInitialScreen = true
      } else if (state.step !== this.props.defaultOption) {
        state.isOnInitialScreen = false
      }
    }

    this.setState({ ...state })
  }

  handleOptionsClick = option => {
    let nextStep

    if (option === 'store/loginOptions.emailVerification') {
      nextStep = 0
    } else if (option === 'store/loginOptions.emailAndPassword') {
      nextStep = 1
    }

    this.setState({
      step: nextStep,
      isOnInitialScreen: false,
      isCreatePassword: false,
    })
  }
  
  handleLoginSuccess = () => {
    const { isHeaderLogin } = this.props
    return this.context.patchSession().then(() => {
      if (isHeaderLogin) {
        window && window.location && window.location.reload()
      } else {
        this.props.redirectAfterLogin()
      }
    })
  }

  renderChildren = () => {
    const {
      profile,
      isInitialScreenOptionOnly,
      optionsTitle,
      defaultOption,
      providerPasswordButtonLabel,
    } = this.props
    const { isOnInitialScreen } = this.state

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    return (
      <>
        <AuthStateLazy.IdentityProviders>
          {({ value: options }) => {
            const [
              shouldRedirectToOauth,
              oauthProvider,
            ] = this.shouldRedirectToOAuth(options)
            return shouldRedirectToOauth && oauthProvider ? (
              <OAuthAutoRedirect provider={oauthProvider.providerName} />
            ) : (
              <LoginOptions
                page="login-options"
                fallbackTitle="store/loginOptions.title"
                title={optionsTitle}
                options={{
                  accessKeyAuthentication: options.accessKey,
                  classicAuthentication: options.password,
                  providers: options.oAuthProviders,
                }}
                currentStep={
                  step === 0
                    ? 'store/loginOptions.emailVerification'
                    : 'store/loginOptions.emailAndPassword'
                }
                isAlwaysShown={!isInitialScreenOptionOnly}
                onOptionsClick={this.handleOptionsClick}
                onLoginSuccess={this.handleLoginSuccess}
                providerPasswordButtonLabel={providerPasswordButtonLabel}
              />
            )
          }}
        </AuthStateLazy.IdentityProviders>
        <div className={`${styles.termsAndConditions} t-mini c-muted-2 tc`}>
         <Markdown source={this.props.termsAndConditions} />
        </div>
      </>
    )
  }

  render() {
    const {
      profile,
      isInitialScreenOptionOnly,
      defaultOption,
      runtime,
      returnUrl,
    } = this.props

    const { isOnInitialScreen, sessionProfile } = this.state

    // Check if the user is already logged and redirect to the return URL if it didn't receive
    // the profile by the props and current endpoint are /login, if receive it, should render the account options.
    if (sessionProfile && !profile) {
      if (location.pathname.includes('/login')) {
        runtime.navigate({
          to: returnUrl,
          fallbackToWindowLocation: true,
        })
      }
    }

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    const renderForm = STEPS[step](
      {
        props: this.props,
        state: this.state,
        handleStateChange: this.handleStateChange,
        isOptionsMenuDisplayed: this.shouldRenderLoginOptions,
        handleLoginSuccess: this.handleLoginSuccess,
      }
    )

    const className = classNames(
      `${styles.content} flex relative bg-base justify-around overflow-visible pa4 center`,
      (this.shouldRenderForm && this.shouldRenderLoginOptions) ? 'items-start-ns' : 'items-baseline-ns',
      {
        [styles.contentInitialScreen]: this.state.isOnInitialScreen,
        [`${styles.contentAlwaysWithOptions} mw6-ns flex-column-reverse items-center flex-row-ns`]: !isInitialScreenOptionOnly,
        'items-baseline': isInitialScreenOptionOnly,
      }
    )

    const formClassName = classNames(styles.contentForm, 'dn ph4', {
      [`${styles.contentFormVisible} db `]: this.shouldRenderForm,
    })
    
    return (
      <div className={className}>
        {!profile && this.shouldRenderLoginOptions
          ? this.renderChildren()
          : null}
        <div className={formClassName}>
          {this.shouldRenderForm && renderForm ? (
            /** If it renders both the form and the menu, wrap the
             * form in a Suspense, so it doesn't hide the options
             * while it's loading */
            this.shouldRenderLoginOptions ? (
              <Suspense fallback={<Loading />}>
                {renderForm()}
              </Suspense>
            ) : renderForm()
          ) : null}
        </div>
      </div>
    )
  }
}

const LoginContentWrapper = props => {
  const userEmail = getUserEmailQuery()
  const flowState = getFlowStateQuery()

  const isCreatePassFlow = useMemo(
    () => flowState === FlowState.CREATE_PASSWORD,
    [flowState]
  )

  const defaultOption = useMemo(
    () => (isCreatePassFlow ? steps.CREATE_PASSWORD : props.defaultOption),
    [isCreatePassFlow, props.defaultOption]
  )

  const [
    ,
    { loading: loadingSendAccessKey, error: errorSendAccessKey },
  ] = serviceHooks.useSendAccessKey({
    autorun: isCreatePassFlow,
    actionArgs: {
      useNewSession: true,
      email: userEmail,
    },
  })
  
  const [redirectAfterLogin] = serviceHooks.useRedirectAfterLogin()

  if (isCreatePassFlow && (!userEmail || errorSendAccessKey)) {
    return (
      <LoginContent
        {...props}
        defaultOption={steps.EMAIL_VERIFICATION}
        defaultIsCreatePassword
        redirectAfterLogin={redirectAfterLogin}
      />
    )
  }

  if (loadingSendAccessKey) {
    return (
      <div data-testid="loading-session">
        <Loading />
      </div>
    )
  }
  return (
    <LoginContent
      {...props}
      defaultOption={defaultOption}
      redirectAfterLogin={redirectAfterLogin}
    />
  )
}

const LoginContentProvider = props => {
  const runtime = useRuntime()
  const intl = useIntl()

  const returnUrl = useMemo(() => {
    const {
      page,
      history: {
        location: { pathname, search },
      },
      query : {
        returnUrl: returnUrlQueryString,
      },
    } = runtime
    const currentUrl = page !== 'store.login' ? `${pathname}${search}` : '/' 
    return returnUrlQueryString || currentUrl
  }, [runtime])

  const userEmail = getUserEmailQuery()

  return (
    <AuthStateLazy
      skip={!!props.profile}
      scope="STORE"
      parentAppId={SELF_APP_NAME_AND_VERSION}
      returnUrl={returnUrl}
      email={userEmail}
    >
      {({ loading }) => {
        if (loading) {
          return <div data-testid="loading-session">
            <Loading />
          </div>
        }
        return (
        <LoginContentWrapper {...props} intl={intl} runtime={runtime} returnUrl={returnUrl} />
      )}}
    </AuthStateLazy>
  )
}

export default LoginContentProvider
