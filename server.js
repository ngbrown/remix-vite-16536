import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import http from "node:http";

installGlobals();

const port = process.env.PORT || 3000;
const appOrigin = `http://localhost:${port}`;

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(async (vite) => {
        // HMR_PORT could be `0` to find a random port, but disadvantage
        // would be port changing on `server.js` restarts.
        let port = process.env.HMR_PORT || 24678;
        const server = http.createServer((req, res) => {
          res.setHeader("cross-origin-resource-policy", "cross-origin");
          res.writeHead(404);
          res.end("Not Found");
        });
        port = await new Promise((resolve) =>
          server.listen(port, () => resolve(server.address().port))
        );
        return vite.createServer({
          server: {
            middlewareMode: true,
            hmr: { server, port: port },
          },
        });
      });

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

app.listen(port, () =>
  console.log(`Express server listening at ${appOrigin}`)
);
