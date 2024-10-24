import { AppError } from "@/core/errros/app-error.js";

export class CpfAlreadyExistsError extends AppError {
    constructor() {
        super("CPF already exists.", 409)
    }
}