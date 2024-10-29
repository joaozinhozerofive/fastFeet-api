import { describe, beforeEach, it, expect } from "vitest";
import { randomUUID } from "crypto"
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { DeleteRecipientUseCase } from "./delete-recipient-use-case.js";

let inMemoryRecipientsRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe('Delete a Recipient', async () =>{
    beforeEach(() => {
        inMemoryRecipientsRepository =  new InMemoryRecipientRepository()
        sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
    })

    it(`should be able to delete a recipient by id`, async () => {
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
        expect(response.value).toBe(null)
        expect(inMemoryRecipientsRepository.recipients).toHaveLength(0)
    })

    it(`shouldn't be able to delete a recipient if it doesn't exist`, async () => {
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