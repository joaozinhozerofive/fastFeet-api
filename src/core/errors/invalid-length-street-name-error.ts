import { AppError } from "@/core/errors/app-error.js";

export class InvalidLengthStreetNameError extends AppError {
    constructor() {
        super("Invalid length of street name", 400)
    }
}