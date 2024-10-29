import { AppError } from "@/core/errors/app-error.js";

export class CpfAlreadyExistsError extends AppError {
    constructor() {
        super("CPF already exists.", 409)
    }
}