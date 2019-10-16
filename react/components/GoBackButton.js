import React, { Component, Fragment } from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'
import { IconArrowBack } from 'vtex.store-icons'

import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/translate'
import LoginComponent from './LoginComponent'
import styles from '../styles.css'

const arrow = <IconArrowBack size={10} viewBox="0 0 16 11" />

class GoBackButton extends Component {
  static propTypes = {
    /** Function to change the active tab */
    onStateChange: PropTypes.func,
    /** Data that change the active tab */
    changeTab: PropTypes.object,
    /** Intl object*/
    intl: intlShape,
  }

  render() {
    const { onStateChange, intl, changeTab } = this.props
    return (
      <Fragment>
        <div className={styles.backButton}>
          <ButtonWithIcon
            icon={arrow}
            iconPosition="left"
            variation="tertiary"
            size="small"
            onClick={() => onStateChange(changeTab)}
          >
            <span className="t-small ml2">
              {translate('store/login.goBack', intl)}
            </span>
          </ButtonWithIcon>
        </div>
      </Fragment>

    )
  }
}
export default injectIntl(GoBackButton)
