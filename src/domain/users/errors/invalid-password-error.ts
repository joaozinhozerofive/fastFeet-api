import { AppError } from "@/core/errros/app-error.js";

export class InvalidPasswordError extends AppError {
    constructor() {
        super("Invalid password.", 401)
    }
}