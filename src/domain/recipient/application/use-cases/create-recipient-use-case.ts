import { Either, left, right } from "@/core/either.js";
import { Recipient, RecipientProps } from "../../enterprise/entities/entity-recipient.js";
import { RecipientRepository } from "../repositories/recipient-repository.js";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists.js";
import { NameWithInvalidNumberOfCharactersError } from "@/core/errors/name-with-invalid-number-of-characters-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";

interface CreateRecipienteUseCaseRequest extends RecipientProps {}

type CreateRecipientUseCaseResponse = Either<
    CpfAlreadyExistsError | NameWithInvalidNumberOfCharactersError, 
    {
        recipient: Recipient
    }
>

export class CreateRecipientUseCase {
    constructor(
        private recipientRepository: RecipientRepository
    ){}

    async execute(data: CreateRecipienteUseCaseRequest) : Promise<CreateRecipientUseCaseResponse> {
        const recipient = Recipient.create(data)

        const recipientFromCpf = await this.recipientRepository.findByCpf(recipient.cpf)

        if(recipientFromCpf) return left(new CpfAlreadyExistsError())

        if(!Recipient.isNameWithvalidNumberOfCharacter(recipient.name)) return left(new NameWithInvalidNumberOfCharactersError())

        if(Recipient.isInvalidCpf(recipient.cpf)) return left(new InvalidCpfError())
 
        const recipientCreated = await this.recipientRepository.create(recipient)
        
        return right({
            recipient : recipientCreated
        })
    }
}