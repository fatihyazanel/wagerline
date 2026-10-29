console.log("1. Starting server...");
import Fastify from 'fastify';

console.log("2. Fastify imported");

const app = Fastify({ logger: true });

console.log("3. App created");

app.get('/api/health', async () => {
  console.log("Health check called");
  return { status: 'ok', timestamp: new Date().toISOString() };
});

console.log("4. Routes registered");

app.listen({ port: 3001, host: '0.0.0.0' }, (err, addr) => {
  if (err) throw err;
  console.log(`5. Server listening on ${addr}`);
});

console.log("6. Listen called");
