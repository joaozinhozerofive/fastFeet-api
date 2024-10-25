import { AppError } from "@/core/errros/app-error.js";

export class UserNotFoundError extends AppError {
    constructor() {
        super("User not found.", 404)
    }
}