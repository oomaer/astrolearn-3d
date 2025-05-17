import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url))
  }
})
