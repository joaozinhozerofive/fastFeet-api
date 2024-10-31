import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository.js"
import { describe, beforeEach, it, expect } from "vitest"
import { randomUUID } from "crypto"
import { FindUniquePackageUseCase } from "./find-unique-package-use-case.js"
import { PackageNotFoundError } from "@/core/errors/package-not-found-error.js"
import { Package } from "../../enterprise/entities/entity-package.js"
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js"
import { User } from "@/domain/users/enterprise/entities/entity-user.js"

let inMemoryPackageRepository : InMemoryPackageRepository
let sut : FindUniquePackageUseCase

describe(`Get Package By id`, async () => {
    beforeEach(() => {
        inMemoryPackageRepository = new InMemoryPackageRepository()
        sut = new FindUniquePackageUseCase(
            inMemoryPackageRepository, 
        )
    })

    it(`shouldn't be able to find a package if doesn't exists`, async () => {
        const packageId = randomUUID()

        const response = await sut.execute({
            id: packageId
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(PackageNotFoundError)
        expect(response.value).toMatchObject({
              statusCode: 404  
        })
    })

    it(`should be able to find a package by id`, async () => {
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
            id: packageId
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            package: {
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
        })
    })
})