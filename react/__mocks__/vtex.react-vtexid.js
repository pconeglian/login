import { Component } from 'react'

export const AuthService = {
  RedirectLogout: ({ children }) => children({ action: () => {} }),

  LoginWithAccessKey: ({ children }) =>
    children({ state: { token: 'token' }, loading: true, action: () => {} }),

  LoginWithPassword: ({ children }) =>
    children({
      state: { email: 'email@vtex.com', password: 'password' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  SendAccessKey: ({ children }) =>
    children({
      state: { email: 'email@vtex.com' },
      loading: true,
      action: () => {},
      validation: { validateEmail: () => true },
    }),

  OAuthRedirect: ({ children }) =>
    children({ loading: true, action: () => {} }),

  OAuthPopup: ({ children }) =>
    children({ loading: true, action: () => {} }),

  SetPassword: ({ children }) =>
    children({
      state: { password: 'password', token: 'token' },
      loading: true,
      action: () => {},
      validation: { validatePassword: () => true },
    }),
}

const AuthState = jest.fn(({ children }) => children({ loading: false }))

AuthState.Token = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthState.Password = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthState.Email = jest.fn(({ children }) =>
  children({ value: 'value', setValue: () => {} })
)

AuthState.IdentityProviders = jest.fn(({ children }) =>
  children({
    value: {
      accessKey: true,
      password: true,
      oAuthProviders: [{ providerName: 'Google', className: '' }],
    },
  })
)

export { AuthState }
