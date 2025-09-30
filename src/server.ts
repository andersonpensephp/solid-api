import { env } from '@/env';
import { app } from '@/app.js';

const PORT = env.PORT;

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log(`Server running on port ${PORT}`));
