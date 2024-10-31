import { AppError } from "@/core/errors/app-error.js";

export class InvalidLengthNeighborhoodError extends AppError {
    constructor() {
        super("Invalid length of neighborhood.", 400)
    }
}