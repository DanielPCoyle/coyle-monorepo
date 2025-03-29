# Coyle Monorepo

A full-stack chat application ecosystem managed with Yarn Workspaces. This monorepo powers a real-time chat platform, mobile experience, CMS-backed marketing site, and reusable internal packages.

## 🧱 Monorepo Structure

This is a **Yarn Workspaces** monorepo.

### Applications

- **`@coyle/mobile-chat`** – React Native chat application.
- **`@coyle/web`** – Next.js CMS-integrated website using Builder.io and Algolia. Also includes embedded chat.
- **`@coyle/sockets`** – Express.js server handling real-time communication via Socket.io.

### Packages

- **`@coyle/chat-ui`** – A standalone React SPA for the chat UI, shared across platforms.
- **`@coyle/chat-db`** – Shared chat-related database logic and schema.
- **`@coyle/database`** – Combined database tools, migrations, and config for all apps.
- **`@coyle/e2e-tests`** – End-to-end test suite.

---

## 📦 Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Setup Environment Variables

Create a .env file at the root of your project and define the following:

```env
# Builder.io
NEXT_PUBLIC_BUILDER_API_KEY=
NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY=

# Store
NEXT_PUBLIC_INKSOFT_STORE=

# Algolia
NEXT_PUBLIC_ALGOLIA_CLIENT_ID=
NEXT_PUBLIC_ALGOLIA_CLIENT_KEY=

# OpenAI
NEXT_PUBLIC_OPEN_AI_KEY=

# Auth / Email
NEXT_PUBLIC_JWT_SECRET=
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_EMAIL_APP_PASSWORD=

# Database
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_NAME=
DB_PASSWORD=

# API URLs
REACT_APP_API_BASE_URL=
REACT_APP_SOCKET_SITE=

# Supabase
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_COOKIE_DOMAIN=
```

---

## 🚀 Scripts

### Web (Next.js)
- `yarn web:dev` – Start development server
- `yarn web:build` – Build the app
- `yarn web:lint` – Lint the codebase
- `yarn web:test` – Run unit tests
- `yarn web:start` – Start production server

### Mobile (React Native)
- `yarn mobile:start` – Start Metro bundler / dev tools
- `yarn mobile:lint` – Lint mobile code
- `yarn mobile:test` – Run mobile tests

### Chat Sockets (Express + Socket.io)
- `yarn sockets:start` – Start server
- `yarn sockets:lint` – Lint code
- `yarn sockets:test` – Run tests
- `yarn sockets:deploy` – Custom deployment script (`scripts/deploy-sockets.sh`)

### Chat UI
- `yarn chat:dev` – Dev mode
- `yarn chat:build` – Build for production
- `yarn chat:lint` – Lint chat UI code
- `yarn chat:test` – Run UI tests
- `yarn chat:prettier` – Format code
- `yarn chat:types` – Run type checks

### Database
- `yarn db:create-migration` – Create a new DB migration
- `yarn db:migrate` – Run migrations
- `yarn db:lint` – Lint database logic

### E2E Testing
- `yarn e2e` – Run all end-to-end tests
- `yarn e2e:lint` – Lint test suite

### Utilities
- `yarn lint` – Lint all workspaces
- `yarn test` – Run all tests
- `yarn types` – Run type checks across packages
- `yarn prettier` – Run Prettier across workspaces
- `yarn reinstall` – Clean all node_modules and reinstall dependencies
- `yarn pre-push` – Placeholder for git pre-push hook

### Packing Utilities
- `yarn pack-db` – Package `@coyle/chat-db`
- `yarn pack-ui` – Package `@coyle/chat-ui`

---

## 📁 Scripts Directory

The `scripts/` folder includes custom shell scripts:

- `deploy-sockets.sh` – Deployment automation for socket server
- `pack-db.sh` – Build/package DB logic
- `pack-ui.sh` – Build/package UI components

---

## 📚 Technologies Used

- **Yarn Workspaces**
- **Next.js + Builder.io**
- **React Native**
- **Express.js + Socket.io**
- **Supabase (PostgreSQL)**
- **OpenAI API**
- **Algolia Search**
- **Custom Git Hooks & CI/CD scripts**

---

# Code Coverage

Below is the most recent code coverage for each application and package:

### Applications
- **Chat Mobile**: Refer to `applications/chat-mobile/coverage/index.html` for detailed coverage.
- **Chat Sockets**: Refer to `applications/chat-sockets/coverage/index.html` for detailed coverage.
- **Web**: Coverage data is currently unavailable.

### Packages
- **Chat DB**: Refer to `packages/chat-db/coverage/index.html` for detailed coverage.
- **Chat UI**: Refer to `packages/chat-ui/coverage/index.html` for detailed coverage.

To view the coverage reports, open the respective `index.html` files in your browser.

---

## 👤 Author

Built and maintained by **Daniel P Coyle** – Full-stack engineer passionate about chat, AI, and scalable architecture.

---

## 🛠 Contributions

Feel free to fork, suggest improvements, or contribute directly via PRs! If you run into issues, open an issue or reach out.

---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 📝 Registering an Application or Package

To add a new application or package to the monorepo, follow these steps:

1. **Create the Directory**:
   - Navigate to the appropriate folder (`applications/` or `packages/`) based on whether you are adding an application or a package.
   - Create a new directory for your application or package.

2. **Initialize the Project**:
   - Inside the new directory, run `yarn init` to initialize a new package.
   - Ensure the `package.json` includes the `name` and `version` fields. Use the naming convention `@coyle/<name>`.

3. **Add Dependencies**:
   - Add any required dependencies using `yarn add <dependency>`.
   - If the package depends on other internal packages, add them as dependencies using their workspace names (e.g., `@coyle/chat-db`).

4. **Update `package.json`**:
   - Ensure the `main` and `types` fields point to the correct entry points.
   - Add any necessary scripts (e.g., `build`, `test`, `lint`).

5. **Link the Package**:
   - Add the new package or application to the `workspaces` field in the root `package.json`.

6. **Run Yarn Install**:
   - Run `yarn install` at the root of the monorepo to link the new package or application.

7. **Verify Setup**:
   - Test the new package or application by running its scripts (e.g., `yarn build`, `yarn test`).
   - Ensure it integrates correctly with other packages in the monorepo.

8. **Add to Version Control**:
   - Commit the new directory and any changes to the monorepo configuration.

---
