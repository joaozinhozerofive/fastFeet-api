import { AppError } from "@/core/errors/app-error.js";

export class InvalidLengthCityError extends AppError {
    constructor() {
        super("Invalid length of city.", 400)
    }
}