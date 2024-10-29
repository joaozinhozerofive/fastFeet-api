import { AppError } from "@/core/errors/app-error.js";

export class InvalidStatusPackageError extends AppError {
    constructor() {
        super("Invalid status package.", 400)
    }
}