const path = require('path');
const express = require('express');
// const color = require("colors");
const compression = require('compression');
const proxyMiddleware = require('http-proxy-middleware');
const { static_root, api_prefix, port, proxyConfig, } = require('./config');
const mockApi = require('./mock/index');

const app = express();
app.use(logger);
app.use(compression());
app.use(
  express.static(static_root, {
    dotfiles: 'deny',
    extensions: ['html', 'htm', 'png', 'jgp', 'jpeg', 'ttf', ],
    maxAge: '30 days',
  })
);
app.use(
  api_prefix,
  mockApi,
);
app.use(
  api_prefix,
  proxyMiddleware(proxyConfig)
);
app.use('/*', (req, res) => {
  res.sendFile(path.resolve(static_root, 'index.html'));
});
app.listen(port);

function logger (req, res, next) {
  next();
}
