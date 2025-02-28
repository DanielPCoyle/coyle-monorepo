# Philadelphia Prints Monorepo

This monorepo contains multiple applications and packages for the Philadelphia Prints project. Below is an overview of the structure and instructions for setting up and running the different parts of the project.

## Table of Contents
- [Applications](#applications)
  - [Chat Mobile](#chat-mobile)
  - [Chat Sockets](#chat-sockets)
  - [Web](#web)
- [Packages](#packages)
  - [Database](#database)
- [Tests](#tests)
- [Scripts](#scripts)
- [Installation](#installation)
- [Running the Applications](#running-the-applications)
- [Contributing](#contributing)

## Applications

### Chat Mobile
This is an Expo project for the chat mobile application.

#### Get started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app
   ```bash
   npx expo start
   ```

### Chat Sockets
This application handles socket connections for the chat functionality.

#### Get started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app
   ```bash
   npm start
   ```

### Web
This is the e-commerce website developed using Builder.io, Next.js, and Inksoft.

#### Get started
1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env.local` file at the root and add your Builder.io API key:
   ```env
   NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_api_key
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

## Packages

### Database
This package contains the database schema and migration scripts.

## Tests
This directory contains server-side tests for the project.

## Scripts
The following scripts are available in the root `package.json`:
- `web:dev`: Start the web application in development mode
- `web:build`: Build the web application
- `web:lint`: Lint the web application
- `web:test`: Test the web application
- `web:start`: Start the web application
- `sockets:start`: Start the chat sockets application
- `chat:start`: Start the chat mobile application
- `db:create-migration`: Create a new database migration
- `db:migrate`: Run database migrations
- `server:test`: Run server-side tests

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DanielPCoyle/philaprints.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Applications
To run any of the applications, use the corresponding script from the root `package.json`. For example, to start the web application in development mode:
```bash
npm run web:dev
```

## Contributing
Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.
