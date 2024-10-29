import { AppError } from "@/core/errors/app-error.js";

export class InvalidSessionCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials.", 401)
    }
}