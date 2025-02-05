import { InMemoryPackageRepository } from "@test/repositories/in-memory-package-repository.js"
import { InMemoryRecipientRepository } from "@test/repositories/in-memory-recipient-repository.js"
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js"
import { describe, beforeEach, it, expect } from "vitest"
import { CreatePackageUseCase } from "./create-package-use-case.js"
import { randomUUID } from "crypto"
import { User } from "@/domain/users/enterprise/entities/entity-user.js"
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js"
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js"
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js"
import { InvalidStatusPackageError } from "@/core/errors/invalid-status-package-error.js"
import { InvalidLengthStreetNameError } from "@/core/errors/invalid-length-street-name-error.js"
import { InvalidLengthNeighborhoodError } from "@/core/errors/invalid-length-neighborhood-error.js"
import { InvalidLengthCityError } from "@/core/errors/invalid-length-city-error.js"
import { StateIsRequiredError } from "@/core/errors/state-is-required-error.js"
import { InvalidLengthCepError } from "@/core/errors/invalid-length-cep-error.js"

let inMemoryPackageRepository   : InMemoryPackageRepository
let inMemoryUsersRepository     : InMemoryUsersRepository
let inMemoryRecipientRepository : InMemoryRecipientRepository
let sut : CreatePackageUseCase

describe(`Create Package`, async () => {
    beforeEach(() => {
        inMemoryPackageRepository     = new InMemoryPackageRepository()
        inMemoryUsersRepository       = new InMemoryUsersRepository()
        inMemoryRecipientRepository   = new InMemoryRecipientRepository()
        sut = new CreatePackageUseCase(
            inMemoryPackageRepository, 
            inMemoryUsersRepository,
            inMemoryRecipientRepository
        )
    })

    it(`shouldn't be able to create a package if recipient not exists`, async () => {
        const userId      = randomUUID()
        const recipientId = randomUUID()
  
        const user =  User.create({
            id      : userId,
            cpf     : "125.125.125-25", 
            name    : "User Test", 
            password: "123", 
            role    : "DELIVERY-PEOPLE", 
        })

        inMemoryUsersRepository.users.push(user)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId 
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(RecipientNotFoundError)
        expect(response.value).toMatchObject({
            statusCode: 404
        })
    })

    it(`shouldn't be able to create a package if user not exists`, async () => {
        const userId      = randomUUID()
        const recipientId = randomUUID()

        const recipient   = Recipient.create({
            id      : recipientId,
            cpf     : "125.125.125-25", 
            name    : "Recipient Test", 
        })

        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(UserNotFoundError)
        expect(response.value).toMatchObject({
            statusCode: 404
        })
    })

    it(`shouldn't be able to create a package if the status is anything other than 1, 2, 3 or 4`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
            // @ts-ignore
            status: 5  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidStatusPackageError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a package with invalid street name (with a number of characters less than 3)`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Le",
            userId, 
            status: 4  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidLengthStreetNameError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a package with invalid neighborhood name (with a number of characters less than 3)`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Sa", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
            status: 4  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidLengthNeighborhoodError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a package with invalid city name (with a number of characters less than 3)`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Ri", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
            status: 4  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidLengthCityError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a package with invalid city name (with a number of characters less than 3)`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "", 
            street_name: "Leopoldo Ledra",
            userId, 
            status: 4  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(StateIsRequiredError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create a package with invalid cep (number of character other than 8)`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-0000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
            status: 4  
        }) 

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidLengthCepError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`should be able to create a package`, async () => {
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
        inMemoryRecipientRepository.recipients.push(recipient)
        
        const response = await sut.execute({
            cep: "89.160-000", 
            city: "Rio do Sul", 
            complement: "I don't know", 
            neighborhood: "Santana", 
            recipientId, 
            residence_code: 400, 
            state: "Santa Catarina", 
            street_name: "Leopoldo Ledra",
            userId, 
            status: 4  
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
        expect(inMemoryPackageRepository.packages[0]).toMatchObject({
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
        })
        expect(inMemoryPackageRepository.packages).toHaveLength(1)
    })
})