import { AppError } from "@/core/errros/app-error.js";

export class InvalidCpfError extends AppError {
    constructor() {
        super("Invalid CPF.", 400)
    }
}