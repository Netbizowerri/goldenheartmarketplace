import http from 'http';
const PORT = 3002;
const server = http.createServer((req, res) => {
  res.end('ok');
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP server listening on ${PORT}`);
});
server.on('error', (err) => {
  console.error('Server error:', err);
});
