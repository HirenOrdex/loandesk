// types/error.ts
export interface IError extends Error {
  statusCode?: number;
  message: string;
  stack?: string;
}
