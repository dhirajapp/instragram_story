const express = require('express');
const app = express();
const port = 3000;

function getIp(req) {
  let ip = req.connection.remoteAddress;
  ip = ip.replace('::ffff:', '');

  if (ip == '127.0.0.1') {
    ip = req.headers['x-real-ip'];
  }

  return ip;
}

app.get('/', (req, res) => {
  res.send('Hello World from: ' + getIp(req)+'hello everyone ');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})