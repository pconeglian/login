import React from 'react'

export const ExtensionContainer = ({ id }) => (
  <div className="ExtensionContainer-mock">{id}</div>
)

export const Link = ({ page, className, children }) => (
  <a href={page} className={className}>
    {children}
  </a>
)

const mockedRuntime = {
  page: '',
  history: {
    location: {
      pathname: '',
      search: '',
    },
  },
}

// eslint-disable-next-line react/display-name
export const withRuntimeContext = WrappedComponent => props => {
  return <WrappedComponent {...props} runtime={mockedRuntime} />
}

export const useRuntime = () => mockedRuntime

export const withSession = () => comp => comp
