import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { Button } from 'vtex.styleguide'
import { AuthState, AuthService } from 'vtex.react-vtexid'

import { translate } from '../utils/translate'
import { isValidEmail, isValidPassword } from '../utils/format-check'
import { steps } from '../utils/steps'
import Form from './Form'
import FormError from './FormError'
import PasswordInput from './PasswordInput'
import GoBackButton from './GoBackButton'
import EmailInput from './EmailInput'

import styles from '../styles.css'

/** EmailAndPasswordLogin component. */
class EmailAndPassword extends Component {
  static propTypes = {
    /** Next step */
    next: PropTypes.number.isRequired,
    /** Previous step */
    previous: PropTypes.number.isRequired,
    /** Set the type of password verification ui */
    showPasswordVerificationIntoTooltip: PropTypes.bool,
    /** Title to be displayed */
    title: PropTypes.string,
    /** Placeholder to email input */
    emailPlaceholder: PropTypes.string,
    /** Placeholder to password input */
    passwordPlaceholder: PropTypes.string,
    /** Function to change de active tab */
    onStateChange: PropTypes.func.isRequired,
    /** Intl object*/
    intl: intlShape,
    /** Whether to display the back button */
    showBackButton: PropTypes.bool,
    /** Function called after login success */
    loginCallback: PropTypes.func,
  }

  state = {
    isInvalidEmail: false,
    isInvalidPassword: false,
    isWrongCredentials: false,
    isUserBlocked: false,
  }

  handlePasswordChange = event => {
    this.setState({ isInvalidPassword: false })
    this.props.onStateChange({ password: event.target.value })
  }

  handleCreatePassword = event => {
    this.props.onStateChange({
      step: steps.EMAIL_VERIFICATION,
      isCreatePassword: true,
      isOnInitialScreen: false,
    })
    event.preventDefault()
  }

  handleSuccess = () => {
    this.props.loginCallback()
  }

  handleFailure = err => {
    err.code === 'WrongCredentials'
      ? this.setState({ isWrongCredentials: true })
      : err.code === 'BlockedUser'
        ? this.setState({ isUserBlocked: true })
        : console.error(err)
  }

  handleOnSubmit = (email, password, login) => {
    if (!isValidEmail(email)) {
      this.setState({ isInvalidEmail: true })
    } else if (!isValidPassword(password)) {
      this.setState({ isInvalidPassword: true })
    } else {
      login()
    }
  }

  render() {
    const {
      title,
      intl,
      onStateChange,
      previous,
      showBackButton,
      emailPlaceholder,
      passwordPlaceholder,
      showPasswordVerificationIntoTooltip,
    } = this.props

    const {
      isInvalidEmail,
      isInvalidPassword,
      isWrongCredentials,
      isUserBlocked,
    } = this.state

    return (
      <Form
        className={`${styles.emailVerification} w-100`}
        title={title || translate('store/loginOptions.emailAndPassword', intl)}
        onSubmit={e => this.handleOnSubmit(e)}
        content={
          <Fragment>
            <div className={`${styles.inputContainer} ${styles.inputContainerEmail}`}>
              <AuthState.Email>
                {({ value, setValue }) => {
                  return (
                    <EmailInput
                      value={value || ''}
                      onChange={e => {
                        setValue(e.target.value)
                        this.setState({ isInvalidEmail: false })
                      }}
                      emailPlaceholder={emailPlaceholder ||
                      translate('store/login.email.placeholder', intl)}
                    />
                  )
                }}
              </AuthState.Email>
            </div>
            <FormError show={isInvalidEmail}>
              {translate('store/login.invalidEmail', intl)}
            </FormError>
            <div className={`${styles.inputContainer} ${styles.inputContainerPassword} pv3 flex flex-column`}>
              <AuthState.Password>
                {({ value, setValue }) => (
                  <PasswordInput
                    password={value || ''}
                    onStateChange={({ password }) => {
                      setValue(password)
                    }}
                    placeholder={
                      passwordPlaceholder ||
                      translate('store/login.password.placeholder', intl)
                    }
                    showPasswordVerificationIntoTooltip={
                      showPasswordVerificationIntoTooltip
                    }
                  />
                )}
              </AuthState.Password>
            </div>
            <FormError show={isInvalidPassword}>
              {translate('store/login.invalidPassword', intl)}
            </FormError>
            <FormError show={isWrongCredentials}>
              {translate('store/login.wrongCredentials', intl)}
            </FormError>
            <FormError show={isUserBlocked}>
              {translate('store/login.userBlocked', intl)}
            </FormError>
            <div className={`${styles.formLinkContainer} flex justify-end ph0 pv2`}>
              <a
                href=""
                className="link dim c-link"
                onClick={this.handleCreatePassword}
              >
                <span className="t-small">
                  {translate('store/login.forgotPassword', intl)}
                </span>
              </a>
            </div>
          </Fragment>
        }
        footer={
          <Fragment>
            {showBackButton && (
              <GoBackButton
                onStateChange={onStateChange}
                changeTab={{ step: previous, password: '' }}
              />
            )}
            <div className={`${styles.sendButton} ml-auto`}>
              <AuthService.LoginWithPassword
                useNewSession
                onSuccess={this.handleSuccess}
                onFailure={this.handleFailure}
              >
                {({
                  state: { email, password },
                  loading,
                  action: loginWithPassword,
                  validation: { validateEmail },
                }) => (
                  <Button
                    variation="primary"
                    size="small"
                    type="submit"
                    onClick={e => {
                      e.preventDefault()
                      this.handleOnSubmit(email, password, loginWithPassword)
                    }}
                    isLoading={loading}
                    disabled={!validateEmail(email)}
                  >
                    <span className="t-small">
                      {translate('store/login.signIn', intl)}
                    </span>
                  </Button>
                )}
              </AuthService.LoginWithPassword>
            </div>
          </Fragment>
        }
      >
        <div className={`${styles.formLinkContainer} flex justify-center ph0 mt4`}>
          <a
            href=""
            className="link dim c-link"
            onClick={e => this.handleCreatePassword(e)}
          >
            <span className="t-small">
              {translate('store/login.notHaveAccount', intl)}
            </span>
          </a>
        </div>
      </Form>
    )
  }
}

export default injectIntl(EmailAndPassword)
