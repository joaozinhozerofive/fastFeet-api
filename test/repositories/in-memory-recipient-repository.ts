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

    async deleteById(id: UniqueEntityUUID): Promise<void> {
        const recipient = this.recipients.find(recipient => recipient.id === id)
        
        if(recipient) {
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

    async update(data: Optional<RecipientProps, RecipientPropsOptional>, id: UniqueEntityUUID): Promise<Recipient> {
        const recipient = await this.findById(id)

        if(!recipient) return this.recipients[0]

        for(const key in data) {
            if((data as any)[key]) {
                (recipient as any).props[key] = (data as any)[key]
            }
        }

        return await this.findById(id) || this.recipients[0]
    }
} 