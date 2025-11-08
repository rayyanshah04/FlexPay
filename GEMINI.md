# Project Overview

This is a React Native mobile application for a payment service called "Flexpay". The app allows users to send and receive money, manage their cards, and make payments using QR codes. It uses Redux for state management and React Navigation for routing. The UI is built with React Native Paper and custom components.

# Building and Running

## Prerequisites

*   Node.js (version >= 20)
*   React Native development environment set up for either Android or iOS. See the [official documentation](https://reactnative.dev/docs/set-up-your-environment) for instructions.

## Installation

```bash
npm install
```

## Running the app

### Android

```bash
npm run android
```

### iOS

First, install the CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

Then, run the app:

```bash
npm run ios
```

# Development Conventions

## Linting

The project uses ESLint for linting. To run the linter, use the following command:

```bash
npm run lint
```

## Testing

The project uses Jest for testing. To run the tests, use the following command:

```bash
npm run test
```

## Folder Structure

*   `src/assets`: Contains static assets like images and icons.
*   `src/components`: Contains reusable UI components.
*   `src/navigations`: Contains the navigation logic for the app, using React Navigation.
*   `src/screens`: Contains the different screens of the app.
*   `src/slices`: Contains the Redux slices for state management.
*   `src/store`: Contains the Redux store configuration.
*   `src/theme`: Contains the theme and styling for the app.
*   `src/types`: Contains the TypeScript types for the app.
*   `src/utils`: Contains utility functions.
