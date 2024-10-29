import { Optional } from "@/core/types/optional.js";
import { Either, right } from "@/core/either.js";
import { Recipient, RecipientProps, RecipientPropsOptional } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";

type FindRecipientNearByUseCaseResponse = Either<
    null, 
    {
        recipients : Recipient[] | null
    }
>

export class FindRecipientsNearByUseCase {
    constructor(
        private recipientRepository: RecipientRepository
    ) {}

    async execute(params: Optional<RecipientProps, RecipientPropsOptional>) : Promise<FindRecipientNearByUseCaseResponse> {
        const recipients = await this.recipientRepository.findManyNearBy(params)

        return right({
            recipients
        })
    }
}