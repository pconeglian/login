import React from 'react'
import { FormattedMessage } from 'react-intl'

const messageByOAuthError = {
  AuthorizationCodeAlreadyUsed: (
    <FormattedMessage id="store/error.oauth.refresh" />
  ),
  MissingUserEmail: <FormattedMessage id="store/error.oauth.missingEmail" />,
}

const getOAuthErrorMessage = err => {
  const message = messageByOAuthError[err]
  return message || <FormattedMessage id="store/error.oauth.unknown" />
}

export default getOAuthErrorMessage
