import { Either, left, right } from "@/core/either.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";

type DeleteRecipientUseCaseResponse = Either<
    RecipientNotFoundError, 
    null
>

export class DeleteRecipientUseCase {
    constructor(
        private recipientRepository: RecipientRepository
    ) {}

    async execute(id: UniqueEntityUUID) : Promise<DeleteRecipientUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(id)

        if(!recipient) return left(new RecipientNotFoundError())

        await this.recipientRepository.deleteById(id)   

        return right(null)
    }
}