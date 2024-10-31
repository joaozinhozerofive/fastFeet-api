import { AppError } from "@/core/errors/app-error.js";

export class InvalidLengthCepError extends AppError {
    constructor() {
        super("Invalid length of cep.", 400)
    }
}