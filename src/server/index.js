import path from "path";
import fs from "fs";

import React from "react";
import express from "express";
import { render } from "./render";
import App from "../common/App.js";
import { reducers, watchers } from "../common/state";

const AUTH_BASE_ROUTE_APP = process.env["AUTH_BASE_ROUTE_APP"];
const AUTH_INTERNAL_URL_GRAPH =  process.env["AUTH_INTERNAL_URL_GRAPH"];
const AUTH_EXTERNAL_URL_GRAPH =  process.env["AUTH_EXTERNAL_URL_GRAPH"];
const AUTH_INTERNAL_PORT_APP = process.env["AUTH_INTERNAL_PORT_APP"];
const RESOURCE_BASE_ROUTE = process.env["RESOURCE_BASE_ROUTE"];

const app = express();

app.use(
  AUTH_BASE_ROUTE_APP + "/jquery",
  express.static("/app/node_modules/jquery/dist")
);
app.use(
  AUTH_BASE_ROUTE_APP + "/bootstrap",
  express.static("/app/node_modules/bootstrap/dist")
);
app.use(
  AUTH_BASE_ROUTE_APP + "/font-awesome",
  express.static("/app/node_modules/font-awesome")
);
app.use(AUTH_BASE_ROUTE_APP + "/app", express.static("dist/web"));

app.get("/*", (req, res) => {
  const cxt = {};

  render(
    {
      App,
      req,
      res,
      watchers,
      reducers,
      paths: {
        base: AUTH_BASE_ROUTE_APP,
        resources: RESOURCE_BASE_ROUTE
      },
      urls: {
        external: {
          graphql: AUTH_EXTERNAL_URL_GRAPH
        },
        internal: {
          graphql: AUTH_INTERNAL_URL_GRAPH
        }
      }
    },
    cxt
  );
});

app.listen(AUTH_INTERNAL_PORT_APP, () => {
  console.log(`Server is listening on port.. ${AUTH_INTERNAL_PORT_APP}`);
});
