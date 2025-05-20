// types/error.ts
export interface IError extends Error {
  statusCode?: number;
  message: string;
  stack?: string;
}


export interface ErrorResponse {
  statusCode: number;
  success: false;
  message: string;
  details?: string[];
  error?: string;
}