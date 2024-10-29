import { Either, left, right } from "@/core/either.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";

interface FindUniqueRecipientUseCaseRequest {
    id: UniqueEntityUUID
}

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

    async execute(data: FindUniqueRecipientUseCaseRequest) : Promise<FindUniqueRecipientUseCaseUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(data.id)

        if(!recipient) return left(new RecipientNotFoundError())

        return right({
            recipient
        })
    }
}