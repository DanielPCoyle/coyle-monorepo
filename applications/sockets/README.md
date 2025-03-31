# Chat Sockets

Chat Sockets is a Node.js application that provides real-time communication capabilities using WebSockets. It is built with Express and Socket.IO, and integrates with the @coyle/chat-db package for database interactions.

## Features

- Real-time communication using WebSockets
- Integration with @coyle/chat-db for database operations
- Environment variable management with dotenv
- TypeScript support
- Linting and formatting with ESLint and Prettier
- Unit testing with Vitest

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd chat-sockets
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the required environment variables.

## Scripts

- `yarn start`: Start the application in production mode.
- `yarn dev`: Start the application in development mode with hot-reloading using Nodemon.
- `yarn lint`: Run ESLint to check for code quality issues.
- `yarn test`: Run unit tests using Vitest.
- `yarn types`: Check TypeScript types.
- `yarn prettier`: Check code formatting with Prettier.

## Dependencies

- `@coyle/chat-db`: Database integration
- `dotenv`: Environment variable management
- `express`: Web server framework
- `socket.io`: WebSocket library
- `uuid`: Unique identifier generation
- `vitest`: Unit testing framework

## Dev Dependencies

- `@eslint/js`: ESLint configuration
- `@types/express`: TypeScript types for Express
- `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript
- `@typescript-eslint/parser`: TypeScript parser for ESLint
- `eslint`: Linting tool
- `globals`: Global variables for ESLint
- `prettier`: Code formatter
- `supertest`: HTTP assertions for testing
- `typescript`: TypeScript compiler
- `typescript-eslint`: TypeScript ESLint configuration

## License

This project is licensed under the MIT License.
