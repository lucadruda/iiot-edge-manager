# Manager module for Azure IIoT

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Manager module for Azure IIoT is an IoT Edge module that allows you to interact with the Edge portion of the [Azure Industrial IoT Platform](https://github.com/Azure/Industrial-IoT/).

This module enables a minimal deployment for the IIoT Platform reduced to Edge components only.

It **does not** substitute capabilities or functionalities available in the full product and assumes these resources to be already available:

- Azure IoT Hub (S1 preferred)
- Azure IoT Edge
- Azure Device Provisioning Service (Optional)

## Getting started

Build and deploy module on the Edge device by following official Microsoft instructions [here](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-vs-code-develop-module?view=iotedge-2020-11).

### Configure module

The configuration of the manager can be made by environment variables.

```
ENDPOINT=<value>
    - mandatory
    The IIoT server endpoint to manage

PORT=<value>
    - default 8888
    Port for the REST Http server.
    The port has to be exposed in order to interact with the module using REST from outside the docker environment
```

### Deploy
Sample deployment manifests are available in the repo.
## Manage
### REST APIs

- _browse_

Browse available nodes.

```apib
# GET /browse/{?nodeId}
+ Response 200 (application/json)
    {
        "node":{...},
        "references":[...]
    }

```

- _read_

Read values for the specified nodes.

```apib
# POST /read
+ Request (application/json)
    [
    {
        "nodeId": "node1"
    },
    ...
    {
        "nodeId": "nodeN"
    }
]
+ Response 200 (application/json)
     [
    {
        "nodeId": "node1",
        "value": value1
    },
    ...
    {
        "nodeId": "nodeN",
        "value": valueN
    }
]

```

- _write_

Write values for the specified nodes.

```apib
# POST /write
+ Request (application/json)
    [
    {
        "nodeId": "node1",
        "value": value1
    },
    ...
    {
        "nodeId": "nodeN",
        "value": valueN
    }
]
+ Response 200 (application/json)
     [
    {
        "nodeId": "node1",
        "value": value1
    },
    ...
    {
        "nodeId": "nodeN",
        "value": valueN
    }
]

```

### Direct methods

The below direct methods are available to interact with the module through IoT Hub:

- _valuereadbulk_

Reads node values in bulk. Accepts an array of _ValueReadModel_ objects.

- _valuewritebulk_

Writes node values in bulk. Accepts an array of _ValueWriteModel_ objects.

### Models

**ValueReadModel**

Node value read request

| Name                      | Description                                                                                                                                                  | Schema           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| browsePath<br/>_optional_ | An optional path from NodeId instance to the actual node.                                                                                                    | < string > array |
| indexRange<br/>_optional_ | Index range to read e.g. 1:2,0:1 for 2 slices out of a matrix or 0:1 for the first item in an array, string or bytestring. See 7.22 of part 4: NumericRange. | string           |
| nodeId                    | Node to read from                                                                                                                                            | string           |

**ValueWriteModel**

Node value write request

| Name                      | Description                                                                                                                                                  | Schema           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| browsePath<br/>_optional_ | An optional path from NodeId instance to the actual node.                                                                                                    | < string > array |
| indexRange<br/>_optional_ | Index range to read e.g. 1:2,0:1 for 2 slices out of a matrix or 0:1 for the first item in an array, string or bytestring. See 7.22 of part 4: NumericRange. | string           |
| dataType<br/>_optional_   | A built in datatype for the value. This can be a data type from browse, or a built in type. <br/>(default: best effort)                                      | string           |
| nodeId                    | Node id to to write value to.                                                                                                                                | string           |
| value                     | Value to write. The system tries to convert the value according to the data type value, e.g. convert comma seperated value strings into arrays.              | string           |

## License

Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the [MIT](LICENSE) License.
