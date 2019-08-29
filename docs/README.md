# VTEX Login app

## Description

The VTEX Login app responsible to handle user login, and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [2.x]  | **Current Release** |   2018-11-08    |                       |             |         2.x         |
|  [1.x]  | **Maintenance LTS** |   2018-07-26    |      2018-11-08       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the login as a block in our [Store Header](https://github.com/vtex-apps/store-header/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  "dependencies": {
    "vtex.login": "2.x"
  }
```

Then, add `login` or `login-content` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json). `login-content` is just the login form and `login` contains the login form and adds the possibility of other display modes such as pop-up.

Now, you can change the behavior of the `login` block that is in the store header. See an example of how to configure:

```json
"login": {
  "props": {
    "emailAndPasswordTitle": "LOG-IN",
    "accessCodeTitle": "Acess Code LOG-IN",
    "emailPraceholder": "e-mail",
    "passwordPlaceholder": "password",
    "showPasswordVerificationIntoTooltip": true,
  }
}
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within `login` and `login-content` and describes if they are required or optional.

```json
{
  "login": {
    "component": "Login"
  },
  "login-content": {
    "component": "LoginContent"
  }
}
```

For now these blocks do not have any required or optional blocks.

#### Configuration

Through the Storefront, you can change the `login`'s behavior and interface. However, you also can make in your theme app, as Store theme does.

| Prop name                             | Type      | Description                                      | Default value |
| ------------------------------------- | --------- | ------------------------------------------------ | ------------- |
| `optionsTitle`                        | `String`  | Set title of login options                       | -             |
| `emailAndPasswordTitle`               | `String`  | Set title of login with email and password       | -             |
| `accessCodeTitle`                     | `String`  | Set title of login by access code                | -             |
| `emailPlaceholder`                    | `String`  | Set placeholder to email input                   | -             |
| `passwordPlaceholder`                 | `String`  | Set placeholder to password input                | -             |
| `showPasswordVerificationIntoTooltip` | `Boolean` | Set show password format verification as tooltip | -             |
| `acessCodePlaceholder`                | `String`  | Set placeholder to access code input             | -             |

You can also change the `login-content`'s behaviour and interface through the Store front.

| Prop name                             | Type      | Description                                                                           | Default value |
| ------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------- |
| `isInitialScreenOptionOnly`           | `Boolean` | Set to show only the login options on the initial screen                              | true          |
| `defaultOption`                       | `Enum`    | Set the initial form to show. 0 for access code login, 1 for email and password login | 0             |
| `optionsTitle`                        | `String`  | Set title of login options                                                            | -             |
| `emailAndPasswordTitle`               | `String`  | Set title of login with email and password                                            | -             |
| `accessCodeTitle`                     | `String`  | Set title of login by access code                                                     | -             |
| `emailPlaceholder`                    | `String`  | Set placeholder to email input                                                        | -             |
| `passwordPlaceholder`                 | `String`  | Set placeholder to password input                                                     | -             |
| `showPasswordVerificationIntoTooltip` | `Boolean` | Set show password format verification as tooltip                                      | -             |
| `acessCodePlaceholder`                | `String`  | Set placeholder to access code input                                                  | -             |

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.login.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

| Class name                 | Description                          | Component Source                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `container`                | Login main container                 | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `contentInitialScreen`     | Login Content initial screen         | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentFormVisible`       | Login Content form                   | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `profile`                  | Profile email or name when logged in | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `label`                    | Icon label                           | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `optionsSticky`            | Login options in sticky mode         | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsList`              | Login options list                   | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsListItem`          | Login options item                   | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsListItemContainer` | Container in Login options           | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `oauthProvider`            | OAuth provider name                  | [OAuth](/react/components/OAuth.js)                                                                                                                                                                                                          |
| `inputContainer`           | Any input container                  | [CodeConfirmation](/react/components/CodeConfirmation.js), [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js) |
| `inputContainerAccessCode` | Access code input container          | [CodeConfirmation](/react/components/CodeConfirmation.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                                                                                         |
| `inputContainerPassword`   | Password input container             | [EmailAndPassword](/react/components/EmailAndPassword.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                                                                                         |
| `inputContainerEmail`      | Email input container                | [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js)                                                                                                                       |
| `emailVerification`        | Email verification form              | [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                            |
| `formLinkContainer`        | Container for links                  | [EmailAndPassword](/react/components/EmailAndPassword.js)                                                                                                                                                                                    |
| `arrowUp`                  | Arrow up                             | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `buttonLink`               | Button link                          | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `formError`                | Error form                           | [LoginComponent](/react/components/FormError.js)                                                                                                                                                                                             |
| `content`                  | Login Content container              | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `button`                   | Any button                           | [AccountOptions](/react/components/AccountOptions.js), [LoginOptions](/react/components/LoginOptions.js), [OAuth](/react/components/OAuth.js)                                                                                                |
| `sendButton`               | Buttons sending informations         | [CodeConfirmation](/react/components/CodeConfirmation.js), [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js) |
| `buttonSocial`             | Button to social media               | [OAuth](/react/components/OAuth.js)                                                                                                                                                                                                          |
| `buttonDanger`             | Danger button                        | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `backButton`               | Back button                          | [GoBackButton](/react/components/GoBackButton.js)                                                                                                                                                                                            |
| `accountOptions`           | Account options container            | [AccountOption](/react/components/AccountOption.js)                                                                                                                                                                                          |
| `codeConfirmation`         | Code Confirmation container          | [CodeConfirmation](/react/components/CodeConfirmation.js)                                                                                                                                                                                    |
| `formTitle`                | Form Title                           | [FormTitle](/react/components/FormTitle.js)                                                                                                                                                                                                  |
| `box`                      | Login box                            | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentContainer`         | Login content container              | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `formFooter`               | Form footer container                | [FormFooter](/react/components/FormFooter.js)                                                                                                                                                                                                |
| `contentForm`              | Login Content form                   | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentAlwaysWithOptions` | Login content with options           | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `options`                  | Login Options container              | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `tooltipContainer`         | Tooltip Container                    | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |
| `tooltipContainerTop`      | Tooltip Top                          | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |
| `tooltipContainerLeft`     | Tooltip Left                         | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/login/issues). Also feel free to [open issues](https://github.com/vtex-apps/login/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

To execute our tests go to `react/` folder and run `yarn test`

### Travis CI

[![Build Status](https://travis-ci.org/vtex-apps/login.svg?branch=master)](https://travis-ci.org/vtex-apps/login)
