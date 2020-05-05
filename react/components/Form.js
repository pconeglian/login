import React from 'react'
import PropTypes from 'prop-types'

import FormTitle from './FormTitle'
import FormFooter from './FormFooter'
import styles from '../styles.css'

export default function Form({
  className,
  title,
  subtitle,
  content,
  footer,
  onSubmit,
  children,
}) {
  return (
    <div className={className}>
      <FormTitle>
        {title}
        {subtitle && (
          <div className={`${styles.formSubtitle} mt5 t-body c-muted-1`}>
            {subtitle}
          </div>
        )}
      </FormTitle>
      <form onSubmit={onSubmit}>
        {content}
        <FormFooter>{footer}</FormFooter>
        {children}
      </form>
    </div>
  )
}

Form.propTypes = {
  className: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
}
