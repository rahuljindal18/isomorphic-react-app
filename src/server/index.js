import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";
import serialize from "serialize-javascript";
import App from "../shared/App";
import { matchPath, StaticRouter } from "react-router-dom";
import routes from "../shared/routes";

const app = express();

app.use(cors());

app.use(express.static("public"));

app.get("*", (req, res, next) => {
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {};
  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve();
  promise
    .then((data) => {
      const context = { data };
      const markup = renderToString(
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      );
      const html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Isomorphic React</title>
                <script src="/bundle.js" defer></script>
                <script>window.initialData=${serialize(data)}</script>
            </head>
            <body>
                <div id="app">${markup}</div>
            </body>
            </html>`;
      res.send(html);
    })
    .catch(next);
});

app.listen(3000, console.log("Server is listening on port 3000"));
