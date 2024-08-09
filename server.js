
const http = require('http');
const app = require('./app'); // Assuming 'app' exports your Express app

const port = process.env.PORT || 3000; // Use 'PORT' environment variable

const server = http.createServer(app); // Pass 'app' to handle requests

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
