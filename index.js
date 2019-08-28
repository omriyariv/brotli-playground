const compression = require('compression')
const express = require('express')

const PORT = 3000;
const NUM_FLUSHES = 5;
const FLUSH_INTERVAL = 1000;
const BYTES_LENGTH = 1 * 1024; // 40kb, bug reproduces also for 100kb/500kb/1000kb

const app = express();
const payload = Buffer.alloc(BYTES_LENGTH, '.');

// compress responses, supports Brotli, see default encoding params here
// https://github.com/nodejs/node/blob/b91093f0e529229cb2810dbc22781a57a71c3749/deps/brotli/c/include/brotli/encode.h#L59-L64
app.use(compression());

const inlineScript = `
  window.counter = window.counter || 1;
  console.log(Date.now(), window.counter);
  window.counter++;
`;

app.get('/', function (req, res) {
  let flushCount = 0;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200);
  res.write('<!DOCTYPE html><html><body>');

  // send response in phases
  let timer = setInterval(function () {
    res.write(`<div>${payload}</div>\n\n`);
    res.write(`<script>${inlineScript}</script>\n\n`);
    res.flush();

    if (++flushCount === NUM_FLUSHES) {
      res.write('</body></html>');
      res.end();
    }
  }, FLUSH_INTERVAL);

  res.on('close', function () {
    clearInterval(timer);
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
