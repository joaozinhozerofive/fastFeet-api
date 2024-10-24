import { beforeEach, describe, expect, it } from "vitest";
import { User } from "../../enterprise/entities/entity-user.js";
import { CreateUserUseCase } from "./create-user-use-case.js";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { CpfAlreadyExistsError } from "../../errors/cpf-already-exists.js";
import { InvalidCpfError } from "../../errors/invalid-cpf.js";
import { randomUUID } from "crypto"

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create user', () => {
    beforeEach(() => {
        inMemoryUsersRepository =  new InMemoryUsersRepository()
        sut = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it('should be able create an user', async () => {
        const uuid = randomUUID()
        const user = User.create({
            id       : uuid,
            cpf      : "159.235.225-96", 
            name     : "user test", 
            password : "123456", 
            role     : "ADMIN"
        })

        const response = await sut.execute({
            id      : uuid,
            cpf     : user.cpf, 
            name    : user.name, 
            password: user.password, 
            role    : user.role
        })

        expect(inMemoryUsersRepository.users).toHaveLength(1)
        expect(response.isRight()).toBe(true)
        expect(inMemoryUsersRepository.users).toEqual([
            expect.objectContaining({
                id  : uuid,
                cpf : "15923522596", 
                name: "user test", 
                role: "ADMIN" 
            })
        ])
        expect(response.value).toMatchObject({
            user : {
                cpf : "15923522596", 
                name: "user test", 
                role: "ADMIN"
            }
        })
        
        expect(inMemoryUsersRepository.users[0].password).not.toEqual("123456")
    })

    it("shouldn't be able create an user with existing cpf", async () => {
        const user = User.create({
            id      : randomUUID(),
            cpf     : "123.456.789-10", 
            name    : "first user", 
            password: "1234567", 
            role    : "DELIVERY-PEOPLE"
        })

        await sut.execute({
            cpf: user.cpf, 
            name: user.name, 
            password: user.password, 
            role: user.role
        })

        const response = await sut.execute({
            cpf: user.cpf, 
            name: user.name, 
            password: user.password, 
            role: user.role
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(CpfAlreadyExistsError)
        expect(response.value).toMatchObject({
            statusCode: 409
        })
    })

    it("shouldn't be able create an user with invalid cpf (with a number of characters other than 11)", async () => {
        const user = User.create({
            id      : randomUUID(),
            cpf     : "12325.456.789-10", 
            name    : "user test", 
            password: "1234567", 
            role    : "DELIVERY-PEOPLE"
        })

        const response = await sut.execute({
            cpf: user.cpf, 
            name: user.name, 
            password: user.password, 
            role: user.role
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidCpfError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })
})