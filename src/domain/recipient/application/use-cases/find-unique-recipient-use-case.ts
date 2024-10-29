import { Either, left, right } from "@/core/either.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";

type FindUniqueRecipientUseCaseUseCaseResponse = Either<
    RecipientNotFoundError, 
    {
        recipient : Recipient
    }
>

export class FindUniqueRecipientUseCase {
    constructor(
        private recipientRepository: RecipientRepository
    ) {}

    async execute(id: UniqueEntityUUID) : Promise<FindUniqueRecipientUseCaseUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(id)

        if(!recipient) return left(new RecipientNotFoundError())

        return right({
            recipient
        })
    }
}