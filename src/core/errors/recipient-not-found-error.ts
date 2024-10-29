import { AppError } from "@/core/errors/app-error.js";

export class RecipientNotFoundError extends AppError {
    constructor() {
        super("Recipient not found.", 404)
    }
}