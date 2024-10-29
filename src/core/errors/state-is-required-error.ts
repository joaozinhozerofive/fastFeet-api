import { AppError } from "@/core/errors/app-error.js";

export class StateIsRequiredError extends AppError {
    constructor() {
        super("State is required.", 400)
    }
}