import { Optional } from "@/core/types/optional.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { RecipientRepository } from "@/domain/recipient/application/repositories/recipient-repository.js";
import { Recipient, RecipientProps, RecipientPropsOptional } from "@/domain/recipient/enterprise/entities/entity-recipient.js";

export class InMemoryRecipientRepository implements RecipientRepository {
    public recipients : Recipient[] = []
    async create(data: Recipient): Promise<Recipient> {
        const recipient = Recipient.create(data)
        this.recipients.push(recipient)

        return recipient
    }

    async delete(recipient: Recipient): Promise<void> {
        const recipientFromId = this.recipients.find(data => data.id === recipient.id)
        
        if(recipientFromId) {
            this.recipients = this.recipients.filter(newRecipient => newRecipient.id != recipient.id)
        }
    }

    async findByCpf(cpf: string): Promise<Recipient | null> {
        return this.recipients.find(recipient => recipient.cpf === cpf) || null            
    }

    async findById(id: UniqueEntityUUID): Promise<Recipient | null> {
        return this.recipients.find(recipient => recipient.id === id) || null            
    }

    async findManyNearBy(params: Optional<RecipientProps, RecipientPropsOptional>): Promise<Recipient[] | null> {
        const recipient = this.recipients.filter(recipient => {
            for(const key in params) {
                if((params as any)[key]) {
                    const recipientValue  = String((recipient as any)[key]).toLowerCase()
                    const paramValue = String((params as any)[key]).toLowerCase()

                    return recipientValue.includes(paramValue) 
                }
            }
        })

        return recipient
    }

    async update(data: Recipient): Promise<Recipient> {
        const index = this.recipients.findIndex(recipient => recipient.id === data.id)

        if(index < 0) return this.recipients[0]
        
        this.recipients[index] = data 

        return this.recipients[index]
    }
} 