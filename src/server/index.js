import path from "path";
import fs from "fs";

import React from "react";
import express from "express";
import { render } from "./render";
import App from "../common/App.js";
import { reducers, watchers } from "../common/state";

import * as Utils from "@nebulario/microservice-utils";
import * as Logger from "@nebulario/microservice-logger";

const ENV_MODE = process.env["ENV_MODE"];
const ENV_LOG_FOLDER = process.env["ENV_LOG_FOLDER"];

const AUTH_BASE_ROUTE_APP = process.env["AUTH_BASE_ROUTE_APP"];
const AUTH_INTERNAL_URL_GRAPH = process.env["AUTH_INTERNAL_URL_GRAPH"];
const AUTH_EXTERNAL_URL_GRAPH = process.env["AUTH_EXTERNAL_URL_GRAPH"];
const AUTH_INTERNAL_PORT_APP = process.env["AUTH_INTERNAL_PORT_APP"];
const RESOURCE_BASE_ROUTE = process.env["RESOURCE_BASE_ROUTE"];

const cxt = {
  env: {
    mode: ENV_MODE,
    logs: {
      folder: ENV_LOG_FOLDER
    }
  },
  logger: null
};

cxt.logger = Logger.create({ path: cxt.env.logs.folder, env: ENV_MODE }, cxt);

(async () => {
  const app = express();
  Logger.Service.use(app, cxt);

  app.use(AUTH_BASE_ROUTE_APP + "/app", express.static("dist/web"));

  app.get("/*", (req, res) => {
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
    cxt.logger.info("server.running", { port: AUTH_INTERNAL_PORT_APP });
  });
})().catch(e => cxt.logger.error("service.error", { error: e.toString() }));

Utils.Process.shutdown(signal => cxt.logger.debug("shutdown", { signal }));
