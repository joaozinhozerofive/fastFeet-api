import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { Recipient, RecipientProps, RecipientPropsOptional } from "../../enterprise/entities/entity-recipient.js";
import { Optional } from "@/core/types/optional.js";

export interface RecipientRepository{
    recipients: Recipient[]
    create(data: Recipient) : Promise<Recipient> 
    findById(id: UniqueEntityUUID) : Promise<Recipient | null>
    findByCpf(cpf: string) : Promise<Recipient | null>
    findManyNearBy(params: Optional<RecipientProps, RecipientPropsOptional>): Promise<Recipient[] | null>
    update(data: Optional<RecipientProps, RecipientPropsOptional>, id: UniqueEntityUUID) : Promise<Recipient>
    deleteById(id: UniqueEntityUUID) : Promise<void>
}