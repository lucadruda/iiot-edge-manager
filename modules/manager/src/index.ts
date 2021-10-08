import { startServer } from "./apiserver";
import { ManagerClient } from "./client";

ManagerClient.create().then((managerClient) => {
  startServer(managerClient);
});
