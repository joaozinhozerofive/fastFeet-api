import { AppError } from "@/core/errros/app-error.js";

export class InvalidSessionCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials.", 401)
    }
}