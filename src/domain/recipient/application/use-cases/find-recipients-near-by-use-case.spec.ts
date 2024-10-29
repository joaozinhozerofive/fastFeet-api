import { describe, beforeEach, it, expect } from "vitest";
import { randomUUID } from "crypto"
import { FindRecipientsNearByUseCase } from "./find-recipients-near-by-use-case.js";
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";

let inMemoryRecipientsRepository: InMemoryRecipientRepository
let sut: FindRecipientsNearByUseCase

describe('Find Many Users By Params', async () =>{
    beforeEach(() => {
        inMemoryRecipientsRepository =  new InMemoryRecipientRepository()
        sut = new FindRecipientsNearByUseCase(inMemoryRecipientsRepository)
    })

    it(`should be able to find a recipient by id`, async () => {
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
            recipients : [
                expect.objectContaining({
                    id          : recipient.id, 
                    name        : recipient.name, 
                    cpf         : recipient.cpf, 
                    phone_number: recipient.phone_number
                })
            ]
        })
    })

    it(`should be able to find a recipient by cpf`, async () => {
        const uuid = randomUUID()
        const recipient = Recipient.create({
            id          :  uuid, 
            name        : "Recipient Test", 
            cpf         : "159.159.159-62", 
            phone_number: "47 98888-8888"
        })

        inMemoryRecipientsRepository.recipients.push(recipient)

        const response = await sut.execute({
            cpf: recipient.cpf
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            recipients : [
                expect.objectContaining({
                    id          : recipient.id, 
                    name        : recipient.name, 
                    cpf         : recipient.cpf, 
                    phone_number: recipient.phone_number
                })
            ]
        })
    })

    it(`should be able to find a recipient by name`, async () => {
        const uuid = randomUUID()
        const recipient = Recipient.create({
            id          :  uuid, 
            name        : "Recipient Test", 
            cpf         : "159.159.159-62", 
            phone_number: "47 98888-8888"
        })

        inMemoryRecipientsRepository.recipients.push(recipient)

        const response = await sut.execute({
            name: "recipient te"
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            recipients : [
                expect.objectContaining({
                    id          : recipient.id, 
                    name        : recipient.name, 
                    cpf         : recipient.cpf, 
                    phone_number: recipient.phone_number
                })
            ]
        })
    })
})