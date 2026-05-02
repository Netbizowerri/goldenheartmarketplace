import express from 'express';
const app = express();
const PORT = 3001;
app.get('/', (req, res) => res.json({ok: true}));
app.listen(PORT, '0.0.0.0', () => console.log(`Test server listening on ${PORT}`));
