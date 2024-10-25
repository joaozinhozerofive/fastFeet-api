import { beforeEach, describe, expect, it } from "vitest";
import { User } from "../../enterprise/entities/entity-user.js";
import { CreateUserUseCase } from "./create-user-use-case.js";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { CpfAlreadyExistsError } from "../../errors/cpf-already-exists.js";
import { InvalidCpfError } from "../../errors/invalid-cpf.js";
import { randomUUID } from "crypto"
import { PasswordWithInvalidNumberOfCharactersError } from "../../errors/password-with-invalid-number-of-characters-error.js";
import { NameWithInvalidNumberOfCharactersError } from "../../errors/name-with-invalid-number-of-characters-error.js";
import { compare } from "bcryptjs";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create an User', () => {
    beforeEach(() => {
        inMemoryUsersRepository =  new InMemoryUsersRepository()
        sut = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it('should be able to create an user', async () => {
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
        
        expect(await compare("123456", inMemoryUsersRepository.users[0].password)).toBe(true)
    })

    it("shouldn't be able to create an user with existing cpf", async () => {
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

    it("shouldn't be able to create an user with invalid cpf (with a number of characters other than 11)", async () => {
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

    it(`shouldn't be able to create an user with password length less than 6 characters`,  async () => {
        const user = User.create({
            id      : randomUUID(),
            cpf     : "152.256.329-63", 
            name    : "user test", 
            password: "123", 
            role    : "DELIVERY-PEOPLE"
        })

        const response = await sut.execute({
            cpf: user.cpf, 
            name: user.name, 
            password: user.password, 
            role: user.role
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(PasswordWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to create an user with name length less than 5 characters`, async () => {
        const user = User.create({
            id      : randomUUID(),
            cpf     : "152.256.329-63", 
            name    : "user t", 
            password: "123456", 
            role    : "DELIVERY-PEOPLE"
        })

        const response = await sut.execute({
            cpf: user.cpf, 
            name: user.name, 
            password: user.password, 
            role: user.role
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(NameWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })
})