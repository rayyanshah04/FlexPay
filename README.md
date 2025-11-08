
<div align="center">
  <img src="src/assets/logo.png" alt="Flexpay Logo" width="150"/>
  <h1 align="center">Flexpay</h1>
  <p align="center">
    A modern mobile payment application built with React Native.
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

---

## About The Project

Flexpay is a React Native mobile application for a seamless payment experience. It allows users to send and receive money, manage their cards, and make payments using QR codes. The app is built with a focus on a clean user interface and a robust state management system.

This repository contains the source code for the mobile application (React Native) and a simple Python backend.

### Key Features

*   **User Authentication**: Secure sign-up and login functionality.
*   **Send & Receive Money**: Easily transfer funds to other Flexpay users.
*   **Card Management**: Add and manage your credit/debit cards.
*   **QR Code Payments**: Make quick payments by scanning QR codes.
*   **Transaction History**: View a history of all your transactions.
*   **Load Money**: Add funds to your Flexpay wallet.

---

## Tech Stack

This project is built with a modern stack of technologies:

*   **Frontend (Mobile)**:
    *   [React Native](https://reactnative.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Redux Toolkit](https://redux-toolkit.js.org/) for state management
    *   [React Navigation](https://reactnavigation.org/) for routing
    *   [React Native Paper](https://reactnativepaper.com/) for UI components
*   **Backend**:
    *   [Python](https://www.python.org/)
    *   [Flask](https://flask.palletsprojects.com/) (as indicated by `app.py`)
*   **Testing & Linting**:
    *   [Jest](https://jestjs.io/) for testing
    *   [ESLint](https://eslint.org/) for linting

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your development machine:

*   Node.js (version >= 20)
*   A React Native development environment set up for either Android or iOS. See the [official documentation](https://reactnative.dev/docs/set-up-your-environment) for detailed instructions.
*   Python and `pip` for the backend.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/FlexPay.git
    cd FlexPay
    ```
2.  **Install NPM packages** for the mobile app:
    ```sh
    npm install
    ```
3.  **Set up the backend** (optional, for full functionality):
    ```sh
    cd backend
    pip install -r requirements.txt
    cd ..
    ```

### Running the Application

#### Backend

To start the backend server:
```sh
cd backend
python app.py
```

#### Mobile App

##### Android

```bash
npm run android
```

##### iOS

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

---

## Development

### Linting

The project uses ESLint for code quality and consistency. To run the linter:

```bash
npm run lint
```

### Testing

The project uses Jest for unit and component testing. To run the tests:

```bash
npm run test
```

---

## Folder Structure

The project follows a standard React Native structure, with a clear separation of concerns.

```
FlexPay/
├── backend/         # Python Flask backend
├── src/
│   ├── assets/      # Images, icons, and other static assets
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── navigations/ # React Navigation setup
│   ├── screens/     # Application screens
│   ├── slices/      # Redux Toolkit slices
│   ├── store/       # Redux store configuration
│   ├── theme/       # Global styles and theme
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── android/         # Android native project
├── ios/             # iOS native project
└── ...
```

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

*(Note: You'll need to add a `LICENSE` file to your project if you don't have one.)*

---

## Acknowledgments

*   [React Native Docs](https://reactnative.dev/docs/getting-started)
*   [Readme Template](https://github.com/othneildrew/Best-README-Template)

