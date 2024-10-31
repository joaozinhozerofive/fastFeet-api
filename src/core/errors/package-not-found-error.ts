import { AppError } from "./app-error.js";

export class PackageNotFoundError extends AppError{
    constructor() {
        super("Package not found.", 404)
    }
}