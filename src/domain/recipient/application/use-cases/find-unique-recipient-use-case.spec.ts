import { describe, beforeEach, it, expect } from "vitest";
import { randomUUID } from "crypto"
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { FindUniqueRecipientUseCase } from "./find-unique-recipient-use-case.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";

let inMemoryRecipientsRepository: InMemoryRecipientRepository
let sut: FindUniqueRecipientUseCase

describe('Find Unique Recipient', async () =>{
    beforeEach(() => {
        inMemoryRecipientsRepository =  new InMemoryRecipientRepository()
        sut = new FindUniqueRecipientUseCase(inMemoryRecipientsRepository)
    })

    it(`should be able to find one and unique recipient by id`, async () => {
        const uuid = randomUUID()
        const recipient = Recipient.create({
            id          :  uuid, 
            name        : "Recipient Test", 
            cpf         : "159.159.159-62", 
            phone_number: "47 98888-8888"
        })

        inMemoryRecipientsRepository.recipients.push(recipient)

        const response = await sut.execute({
            id: uuid
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
                recipient :{
                    id          : recipient.id, 
                    name        : recipient.name, 
                    cpf         : recipient.cpf, 
                    phone_number: recipient.phone_number
                }
        })
    })

    it(`shouldn't be able to find a recipient if it doesn't exist`, async () => {
        const response = await sut.execute({
            id: randomUUID()
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(RecipientNotFoundError)
        expect(response.value).toMatchObject({
                statusCode : 404
        })
    })
})