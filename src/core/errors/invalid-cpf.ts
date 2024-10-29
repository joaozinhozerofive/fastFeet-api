import { AppError } from "@/core/errors/app-error.js";

export class InvalidCpfError extends AppError {
    constructor() {
        super("Invalid CPF.", 400)
    }
}