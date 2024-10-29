import { Either, left, right } from "@/core/either.js";
import { Recipient, RecipientProps, RecipientPropsOptional } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists.js";
import { NameWithInvalidNumberOfCharactersError } from "@/core/errors/name-with-invalid-number-of-characters-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { Optional } from "@/core/types/optional.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";

type UpdateRecipienteUseCaseRequest = Optional<RecipientProps, RecipientPropsOptional>

type UpdateRecipientUseCaseResponse = Either<
    CpfAlreadyExistsError | NameWithInvalidNumberOfCharactersError | RecipientNotFoundError, 
    {
        recipient: Recipient
    }
>

export class UpdateRecipientUseCase {
    constructor(
        private recipientRepository: RecipientRepository
    ){}

    async execute(data: UpdateRecipienteUseCaseRequest, id: UniqueEntityUUID) : Promise<UpdateRecipientUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(id)

        if(!recipient) return left(new RecipientNotFoundError())

        if(data.cpf && await this.existsOtherRecipientWithCpf(data.cpf, recipient)) return left(new CpfAlreadyExistsError())
        
        if(data.cpf && Recipient.isInvalidCpf(recipient.cpf)) return left(new InvalidCpfError())

        if(!Recipient.isNameWithvalidNumberOfCharacter(recipient.name)) return left(new NameWithInvalidNumberOfCharactersError())

        const recipientUpdated = await this.recipientRepository.update(
            Recipient.create({
                id, 
                cpf: data.cpf   || recipient.cpf, 
                name: data.name || recipient.name, 
                phone_number: data.phone_number || recipient.phone_number
            })
        )
        
        return right({
            recipient : recipientUpdated
        })
    }

    private async existsOtherRecipientWithCpf(cpf: string, recipient: Recipient) {
        const recipientFromCpf = await this.recipientRepository.findByCpf(cpf)

        return recipientFromCpf && recipientFromCpf.id !== recipient.id
    }
}