import express from "express";
import { env } from "process";
import { ManagerClient } from "./client";
import {
  isSuccess,
  ENDPOINT,
  ReadRequestBody,
  WriteRequestBody,
} from "./common";

const restApp = express();
const port = env.PORT || 8888;
let moduleClient: ManagerClient;

restApp.use(express.json());
restApp.get("/", (req, res) => {
  res.send("Hello world!");
});

restApp.get("/browse/:nodeId?", async (req, res) => {
  try {
    const data = await moduleClient.invokeMethod("browse_v2", {
      endpoint: {
        url: ENDPOINT,
      },
      request: req.params.nodeId ? { nodeId: req.params.nodeId } : {},
    });
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

restApp.post<{}, any, WriteRequestBody>("/write", async (req, res) => {
  const data = await moduleClient.onBatchWrite({ payload: req.body });
  if (isSuccess(data.status)) {
    res.send(data.payload);
  } else {
    res.status(data.status).send(data.payload);
  }
});

restApp.post<{}, any, ReadRequestBody>("/read", async (req, res) => {
  const data = await moduleClient.onBatchRead({ payload: req.body });
  if (isSuccess(data.status)) {
    res.send(data.payload);
  } else {
    res.status(data.status).send(data.payload);
  }
});

export function startServer(client: ManagerClient) {
  moduleClient = client;
  restApp.listen(port, () => {
    console.log(`Api server listening at port ${port}`);
  });
}
