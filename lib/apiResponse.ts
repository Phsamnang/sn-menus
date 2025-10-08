// /lib/ApiResponse.ts

export class ApiResponse<T> {
  data: T | null;
  status: {
    code: number;
    message: string;
  };
  message: string;

  constructor(params: {
    data?: T | null;
    status?: { code: number; message: string };
    message?: string;
  }) {
    this.data = params.data ?? null;
    this.status = params.status ?? {
      code: 500,
      message: "Internal Server Error",
    };
    this.message = params.message ?? "";
  }

  // ✅ Helper for success response
  static success<T>(
    data: T,
    message = "Success",
    code = 200,
    statusMessage = "OK"
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      data,
      status: { code, message: statusMessage },
      message,
    });
  }

  // ✅ Helper for error response
  static error(
    message = "Error",
    code = 500,
    statusMessage = "Internal Server Error",
    data: any = null
  ): ApiResponse<null> {
    return new ApiResponse<null>({
      data,
      status: { code, message: statusMessage },
      message,
    });
  }
}
