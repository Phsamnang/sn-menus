// /lib/ApiResponse.ts

export class ApiResponse<T> {
  data: T | null;
  status: boolean;
  message: string;

  constructor(params: { data?: T | null; status?: boolean; message?: string }) {
    this.data = params.data ?? null;
    this.status = params.status ?? false;
    this.message = params.message ?? "";
  }

  // Optional: helper for success
  static success<T>(data: T, message = "Success") {
    return new ApiResponse<T>({ data, status: true, message });
  }

  // Optional: helper for error
  static error(message = "Error", data: null = null) {
    return new ApiResponse({ data, status: false, message });
  }
}
