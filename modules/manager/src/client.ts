import {
  DeviceMethodRequest,
  DeviceMethodResponse,
  ModuleClient,
} from "azure-iot-device";
import { Mqtt } from "azure-iot-device-mqtt";
import {
  isSuccess,
  ENDPOINT,
  ReadRequestBody,
  WriteRequestBody,
} from "./common";

const DEVICE_ID = process.env["IOTEDGE_DEVICEID"];
const TWIN_ID = "twin";
const DEFAULT_TIMEOUT = 30;

export class ManagerClient {
  static async create() {
    return new ManagerClient(await ModuleClient.fromEnvironment(Mqtt));
  }

  public async onBatchWrite(
    req?: DeviceMethodRequest | { payload: any },
    res?: DeviceMethodResponse
  ) {
    const _this = this;
    try {
      await Promise.all(
        (req?.payload as WriteRequestBody).map((writereq) => {
          return this.invokeMethod("valuewrite_v2", {
            endpoint: {
              url: ENDPOINT,
            },
            request: writereq,
          });
        }, _this)
      );
      const data = await Promise.all(
        (req?.payload as WriteRequestBody).map((readreq) => {
          return this.invokeMethod("valueread_v2", {
            endpoint: {
              url: ENDPOINT,
            },
            request: readreq,
          });
        }, _this)
      );
      res?.send(200, data);
      return { status: 200, payload: data };
    } catch (ex: any) {
      res?.send(400, ex.message);
      return { status: 400, payload: `${ex.message}\n${ex.stack}` };
    }
  }

  public async onBatchRead(
    req?: DeviceMethodRequest | { payload: any },
    res?: DeviceMethodResponse
  ) {
    const _this = this;
    try {
      const data = await Promise.all(
        (req?.payload as ReadRequestBody).map((readreq) => {
          return this.invokeMethod("valueread_v2", {
            endpoint: {
              url: ENDPOINT,
            },
            request: readreq,
          });
        }, _this)
      );
      res?.send(200, data);
      return { status: 200, payload: data };
    } catch (ex: any) {
      res?.send(400, ex.message);
      return { status: 400, payload: `${ex.message}\n${ex.stack}` };
    }
  }

  private constructor(private moduleClient: ModuleClient) {
    moduleClient.onMethod("valuewritebulk", this.onBatchWrite.bind(this));
    moduleClient.onMethod("valuereadbulk", this.onBatchRead.bind(this));
  }

  public async invokeMethod(methodName: string, payload?: any) {
    if (!DEVICE_ID) {
      throw new Error("Not running on edge");
    }
    const resp = await this.moduleClient.invokeMethod(DEVICE_ID, TWIN_ID, {
      methodName,
      payload,
      connectTimeoutInSeconds: DEFAULT_TIMEOUT,
      responseTimeoutInSeconds: DEFAULT_TIMEOUT,
    });
    if (isSuccess(resp.status)) {
      return resp.payload;
    }
    throw new Error(
      `Failed to invoke. Status ${resp.status}. Error: ${resp.payload}`
    );
  }
}
