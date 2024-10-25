import { AppError } from "@/core/errros/app-error.js";

export class NameWithInvalidNumberOfCharactersError extends AppError {
    constructor() {
        super("Name requires at least 6 characters.", 400)
    }
}