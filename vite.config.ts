import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isE2E = mode === 'e2e'

  return {
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      environment: 'node',
      include: isE2E
        ? ['test/e2e/**/*.test.ts', 'test/e2e/**/*.spec.ts', 'src/**/*.e2e.ts']
        : ['src/**/*.test.ts', 'src/**/*.spec.ts', '!src/**/*.e2e.*'],
      exclude: ['node_modules', 'dist', '.git', 'build'],
      testTimeout: isE2E ? 30000 : 5000,
      hookTimeout: isE2E ? 30000 : 10000,
      ...(isE2E ? { globalSetup: ['prisma/vitest-evironment-prisma/prisma-test-environment.ts'] } : {}),
      // Para evitar condições de corrida em e2e que usam DB compartilhado
      pool: 'threads',
      ...(isE2E ? { poolOptions: { threads: { singleThread: true } } } : {}),
    },
  }
});