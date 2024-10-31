import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateRecipientUseCase } from "./create-recipient-use-case.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { randomUUID } from "crypto"
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists.js";
import { NameWithInvalidNumberOfCharactersError } from "@/core/errors/name-with-invalid-number-of-characters-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";
import { UpdateRecipientUseCase } from "./update-recipient-use-case.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: UpdateRecipientUseCase

describe(`Create a Recipient`, async () => {
    beforeEach(() => {
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new UpdateRecipientUseCase(inMemoryRecipientRepository)
    })

    it(`shouldn't be able to update a recipient if the recipient was not found`, async () => {
        const uuid =  randomUUID()

        const response = await sut.execute({
            cpf : "123.456.789-63", 
            name: "Recipiente Teste", 
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).toMatchObject({
            statusCode : 404
        })
        expect(response.value).instanceOf(RecipientNotFoundError)
    })

    it(`shouldn't be able to update a recipient cpf if already exists one recipient with the same cpf`, async () => {
        inMemoryRecipientRepository.recipients.push(Recipient.create({
            id  : randomUUID(),        
            cpf : "159.189.189-62", 
            name: "Recipiente Teste", 
        }))
        
        const uuid = randomUUID() 
        
        inMemoryRecipientRepository.recipients.push(Recipient.create({
            id  : uuid,        
            cpf : "123.123.123-10", 
            name: "Recipiente Teste", 
        }))

        const response =  await sut.execute({
            cpf: "15918918962"
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).toMatchObject({
            statusCode : 409
        })
        expect(response.value).instanceOf(CpfAlreadyExistsError)
    })

    it(`shouldn't be able to update a recipient cpf with invalid cpf (with a number of characters other than 11)`, async () => {
        const uuid = randomUUID() 
        const recipient =  Recipient.create({
            id  : uuid, 
            cpf : "159.159.159-4", 
            name: "Recipient test",
        })

        inMemoryRecipientRepository.recipients.push(recipient)

        const response = await sut.execute({
            cpf: "158158159663"
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidCpfError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to update a recipient name with name length less than 5 characters`, async () => {
        const uuid = randomUUID()
        const recipient = Recipient.create({
            id  : uuid, 
            cpf : "159.159.159-63", 
            name: "Reci t",
        })

        inMemoryRecipientRepository.recipients.push(recipient)

        const response = await sut.execute({
            name : recipient.name, 
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(NameWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`should be able to update a recipient`, async () => {
        const uuid = randomUUID()
        const recipient = Recipient.create({
            id          : uuid, 
            cpf         : "156.156.987-63", 
            name        : "Recipiente Test", 
            phone_number: "47 98888-3030"
        })

        inMemoryRecipientRepository.recipients.push(recipient)

        const response = await sut.execute({
            cpf          : "158.258.358-98", 
            name         : "Recipient Updated Test", 
            phone_number : "47 98888-8888"
        }, uuid)

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            recipient: {
                cpf         : "15825835898", 
                name        : "Recipient Updated Test", 
                phone_number: "47 98888-8888"
            }
        })
          
        expect(inMemoryRecipientRepository.recipients).toEqual([
            expect.objectContaining({
                cpf         : "15825835898", 
                name        : "Recipient Updated Test", 
                phone_number: "47 98888-8888"
            })
        ])
    })
})