import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./applications/sockets/vitest.config.js",
  "./packages/chat-db/vitest.config.js",
  "./applications/web/vitest.config.js",
  "./packages/chat-ui/vitest.config.js",
  "./packages/chat-api/vitest.config.js",
], {
  coverage: {
    exclude: ['**/coverage/**']
  }
})
