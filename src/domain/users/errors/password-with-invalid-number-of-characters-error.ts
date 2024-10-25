import { AppError } from "@/core/errros/app-error.js";

export class PasswordWithInvalidNumberOfCharactersError extends AppError {
    constructor() {
        super("Password requires at least 6 characters.", 400)
    }
}