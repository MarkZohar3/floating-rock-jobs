import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: process.env.OPENAPI_URL ?? 'http://localhost:3001/api/openapi.json',
    },
    output: {
      mode: 'split',
      target: './src/generated/client.ts',
      schemas: './src/generated/model',
      client: 'fetch',
      baseUrl: process.env.API_URL ?? 'http://localhost:3001',
      clean: true,
    },
  },
});
