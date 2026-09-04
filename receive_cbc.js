const net = require('net');

// Host configuration
const HOST = '192.168.1.123';
const PORT = 5100;

// Create TCP server
const server = net.createServer((socket) => {
  console.log('Connected to analyzer:', socket.remoteAddress);

  socket.on('data', (data) => {
    const message = data.toString();
    console.log('Received data:\n', message);

    // Optionally save or display the result in a UI or database
    // e.g., parse ASTM/HL7 format here
  });

  socket.on('close', () => {
    console.log('Connection closed');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`LIS server listening on ${HOST}:${PORT}`);
});
