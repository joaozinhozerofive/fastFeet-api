import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository.js"
import { describe, beforeEach, it, expect } from "vitest"
import { randomUUID } from "crypto"
import { Package } from "../../enterprise/entities/entity-package.js"
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js"
import { User } from "@/domain/users/enterprise/entities/entity-user.js"
import { FindManyPackagesByUserIdUseCase } from "./find-many-by-user-id-use-case.js"
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js"
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js"

let inMemoryPackageRepository : InMemoryPackageRepository
let inMemoryUsersRepository   : InMemoryUsersRepository
let sut : FindManyPackagesByUserIdUseCase

describe(`Get Package by user id`, async () => {
    beforeEach(() => {
        inMemoryPackageRepository = new InMemoryPackageRepository()
        inMemoryUsersRepository   = new InMemoryUsersRepository()
        sut = new FindManyPackagesByUserIdUseCase(
            inMemoryPackageRepository, 
            inMemoryUsersRepository
        )
    })

    it(`should be able to find packages by user id`, async () => {
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

        inMemoryUsersRepository.users.push(user)

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
            userId
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

    it(`shouldn't be able to find packages if the user not exists`, async () => {
        const userId = randomUUID()

        const response = await sut.execute({
            userId
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(UserNotFoundError)
        expect(response.value).toMatchObject({
            statusCode: 404
        })
    })
})