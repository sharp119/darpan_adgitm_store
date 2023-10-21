# Darpan by Enactus Society of ADGITM

This project is managed by the Enactus Society of ADGITM, developed under the Darpan initiative.

## Getting Started

These instructions will help you set up the project locally for development and testing purposes.

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js
- Yarn

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Delete the `node_modules` folder and the `package-lock.json` file if they exist to ensure a fresh package installation:
    ```bash
    rm -rf node_modules package-lock.json
    ```
4. If you encounter errors after running `yarn` and `yarn start`, you may need to add the resolutions field to your `package.json` file. Open `package.json` and add the following code:
    ```json
    "resolutions": {
        "babel-loader": "8.1.0"
    }
    ```
5. Use Yarn for package management. To download the project dependencies, run:
    ```bash
    yarn
    ```
6. To start the project, run:
    ```bash
    yarn start
    ```
