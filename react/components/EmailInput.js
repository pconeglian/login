import React from 'react'
import { Input } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'

import { translate } from '../utils/translate'

const EmailInput = ({ intl, value, onChange, emailPlaceholder }) => (<Input
  value={value || ''}
  onChange={e => {
    onChange(e.target.value)
    this.setState({ isInvalidEmail: false })
  }}
  placeholder={
    emailPlaceholder ||
    translate('store/login.email.placeholder', intl)
  }
/>)

EmailInput.propTypes = {
  intl: intlShape.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  emailPlaceholder: PropTypes.string,
}

export default injectIntl(EmailInput)
