console.log("Test starting");
const Fastify = require('fastify');
console.log("Fastify loaded");
const app = Fastify({ logger: false });
console.log("Fastify app created");
app.get('/test', async () => ({ ok: true }));
app.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error("Listen error:", err);
    process.exit(1);
  }
  console.log("Server listening on 3001");
});
