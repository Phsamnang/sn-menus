// /lib/ApiResponse.ts
export class ApiResponse {
    data;
    status;
    message;
    constructor(params) {
        this.data = params.data ?? null;
        this.status = params.status ?? {
            code: 500,
            message: "Internal Server Error",
        };
        this.message = params.message ?? "";
    }
    // ✅ Helper for success response
    static success(data, message = "Success", code = 200, statusMessage = "OK") {
        return new ApiResponse({
            data,
            status: { code, message: statusMessage },
            message,
        });
    }
    // ✅ Helper for error response
    static error(message = "Error", code = 500, statusMessage = "Internal Server Error", data = null) {
        return new ApiResponse({
            data,
            status: { code, message: statusMessage },
            message,
        });
    }
}
