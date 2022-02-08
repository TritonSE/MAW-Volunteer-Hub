/*
 * Proxy middleware used by create-react-app's dev
 *   server.
 *
 * Routes all calls to http://localhost:3000/auth/{...}
 *   to http://localhost:5000/auth/{...}
 */
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};