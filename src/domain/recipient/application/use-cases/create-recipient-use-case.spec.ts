import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateRecipientUseCase } from "./create-recipient-use-case.js";
import { Recipient } from "../../enterprise/entities/entity-recipient.js";
import { randomUUID } from "crypto"
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists.js";
import { NameWithInvalidNumberOfCharactersError } from "@/core/errors/name-with-invalid-number-of-characters-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe(`Create a Recipient`, async () => {
    beforeEach(() => {
        inMemoryRecipientRepository = new InMemoryRecipientRepository()
        sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
    })

    it(`shouldn't be able to create a recipient if already exists one recipient whith the same cpf`, async () => {
        const recipient =  Recipient.create({
            id  : randomUUID(), 
            cpf : "159.159.159-63", 
            name: "Recipient test",
        })

        inMemoryRecipientRepository.recipients.push(recipient)

        const response = await sut.execute({
            id          : randomUUID(), 
            cpf         : recipient.cpf, 
            name        : recipient.name, 
            phone_number: recipient.phone_number 
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(CpfAlreadyExistsError)
        expect(response.value).toMatchObject({
            statusCode: 409
        })
    })

    it(`shouldn't be able to create a recipient with name length less than 5 characters`, async () => {
        const recipient =  Recipient.create({
            id  : randomUUID(), 
            cpf : "159.159.159-63", 
            name: "Reci t",
        })

        const response = await sut.execute({
            id          : recipient.id, 
            cpf         : recipient.cpf, 
            name        : recipient.name, 
            phone_number: recipient.phone_number 
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(NameWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a recipient with invalid cpf (with a number of characters other than 11)`, async () => {
        const recipient =  Recipient.create({
            id  : randomUUID(), 
            cpf : "159.159.159-634", 
            name: "Recipient test",
        })

        const response = await sut.execute({
            id          : recipient.id, 
            cpf         : recipient.cpf, 
            name        : recipient.name, 
            phone_number: recipient.phone_number 
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidCpfError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`should be able to create a recipient`, async () => {
        const recipient =  Recipient.create({
            id  : randomUUID(), 
            cpf : "159.159.159-63", 
            name: "Recipient test",
        })

        const response = await sut.execute({
            id          : recipient.id, 
            cpf         : recipient.cpf, 
            name        : recipient.name, 
            phone_number: recipient.phone_number 
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            recipient : {
                id          : recipient.id, 
                cpf         : recipient.cpf, 
                name        : recipient.name, 
                phone_number: recipient.phone_number
            }
        })
        expect(inMemoryRecipientRepository.recipients).toEqual([
            expect.objectContaining({
                id          : recipient.id, 
                cpf         : recipient.cpf, 
                name        : recipient.name, 
                phone_number: recipient.phone_number
            })
        ])
    })
})