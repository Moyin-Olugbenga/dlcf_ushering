export type ApiResponse<T = unknown> = {
  error: boolean;
  errors: string[] | { field?: string; message: string }[];
  data: T | null;
  message: string;
  status: number;
  timeStamp: string;
};

export function createResponse<T = unknown>(
  data: T | null,
  message = '',
  error = false,
  errors: ApiResponse['errors'] = [],
  status = 200
): Response {
  const body: ApiResponse<T> = {
    error,
    errors,
    data,
    message,
    status,
    timeStamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
