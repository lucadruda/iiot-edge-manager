export const ENDPOINT =
  process.env["ENDPOINT"] || "";

export function isSuccess(status: number) {
  return [200, 201].includes(status);
}

export type ReadRequestBody = {
  nodeId?: string;
  browsePath?: string;
}[];

export type WriteRequestBody = {
  nodeId?: string;
  value: any;
  browsePath?: string;
}[];
