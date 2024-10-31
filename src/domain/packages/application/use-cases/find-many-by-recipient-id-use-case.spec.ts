import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository.js"
import { describe, beforeEach, it, expect } from "vitest"
import { randomUUID } from "crypto"
import { Package } from "../../enterprise/entities/entity-package.js"
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js"
import { User } from "@/domain/users/enterprise/entities/entity-user.js"
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js"
import { FindManyPackagesByRecipientIdUseCase } from "./find-many-by-recipient-id-use-case.js"
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js"

let inMemoryPackageRepository   : InMemoryPackageRepository
let inMemoryRecipientRepository : InMemoryRecipientRepository
let sut : FindManyPackagesByRecipientIdUseCase

describe(`Get Package by recipient id`, async () => {
    beforeEach(() => {
        inMemoryPackageRepository = new InMemoryPackageRepository()
        inMemoryRecipientRepository   = new InMemoryRecipientRepository()
        sut = new FindManyPackagesByRecipientIdUseCase(
            inMemoryPackageRepository, 
            inMemoryRecipientRepository
        )
    })

    it(`should be able to find packages by recipient id`, async () => {
        const packageId   = randomUUID()
        const userId      = randomUUID()
        const recipientId = randomUUID()

        const recipient   = Recipient.create({
            id      : recipientId,
            cpf     : "125.125.125-25", 
            name    : "Recipient Test", 
        })
        
        const user =  User.create({
            id      : userId,
            cpf     : "125.125.125-25", 
            name    : "User Test", 
            password: "123", 
            role    : "DELIVERY-PEOPLE", 
        })

        inMemoryRecipientRepository.recipients.push(recipient)

        const newPackage = Package.create({
            id: packageId, 
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipient, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            user, 
            status: 4
        })

        inMemoryPackageRepository.packages.push(newPackage)

        const response = await sut.execute({
            recipientId
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            packages: [
                {
                    cep: "89160000", 
                    city: "Rio do Sul", 
                    complement: "I don't know", 
                    neighborhood: "Santana", 
                    recipient, 
                    residence_code: 400, 
                    state: "Santa Catarina", 
                    street_name: "Leopoldo Ledra",
                    user, 
                    status: 4
                }
            ]
        })
    })

    it(`shouldn't be able to find packages if the recipient not exists`, async () => {
        const recipientId = randomUUID()

        const response = await sut.execute({
            recipientId
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(RecipientNotFoundError)
        expect(response.value).toMatchObject({
            statusCode: 404
        })
    })
})