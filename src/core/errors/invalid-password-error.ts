import { AppError } from "@/core/errors/app-error.js";

export class InvalidPasswordError extends AppError {
    constructor() {
        super("Invalid password.", 401)
    }
}