import { beforeEach, describe, expect, it } from "vitest";
import { User } from "../../enterprise/entities/entity-user.js";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { CpfAlreadyExistsError } from "../../../../core/errors/cpf-already-exists.js";
import { compare, hash } from 'bcryptjs';
import { randomUUID } from "crypto"
import { PasswordWithInvalidNumberOfCharactersError } from "../../../../core/errors/password-with-invalid-number-of-characters-error.js";
import { NameWithInvalidNumberOfCharactersError } from "../../../../core/errors/name-with-invalid-number-of-characters-error.js";
import { UpdateUserUseCase } from "./update-user-use-case.js";
import { UserNotFoundError } from "../../../../core/errors/user-not-found-error.js";
import { InvalidPasswordError } from "../../../../core/errors/invalid-password-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User',  () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new UpdateUserUseCase(inMemoryUsersRepository)
    })

    it(`shouldn't be able to update an user than not exists (by id)`, async () => {
        const response = await sut.execute({
            name: "user teste"
        }, randomUUID())

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(UserNotFoundError)
        expect(response.value).toMatchObject({
            statusCode: 404
        })
    })

    it(`shouldn't be able to update the password if old password not exists`, async () => {
        const uuid = randomUUID()
        const user = User.create({
            id       : uuid,
            cpf      : "159.235.225-96", 
            name     : "user test", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            password: "1234567"
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidPasswordError)
        expect(response.value).toMatchObject({
            statusCode: 401
        })
    })

    it(`shouldn't be able to update the password if it has less than 6 characters`, async () => {
        const uuid = randomUUID()
        const user = User.create({
            id       : uuid,
            cpf      : "159.235.225-96", 
            name     : "user test", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            password    : "123", 
            old_password: "123456"
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(PasswordWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to update the name if it has less than 6 characters`, async () => {
        const uuid = randomUUID()
        const user = User.create({
            id       : uuid,
            cpf      : "159.235.225-96", 
            name     : "user t", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            password    : "1234567", 
            old_password: "123456",
            name        : user.name
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(NameWithInvalidNumberOfCharactersError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`shouldn't be able to update the password if old password isn't valid`, async () => {
        const uuid = randomUUID()
        const user = User.create({
            id       : uuid,
            cpf      : "159.235.225-96", 
            name     : "user test", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            password    : "1234567", 
            old_password: "123454"
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidPasswordError)
        expect(response.value).toMatchObject({
            statusCode: 401
        })
    })

    it(`shouldn't be able update to cpf if already exists other user using this cpf`, async () => {
        inMemoryUsersRepository.users.push(
            User.create({
                id       : randomUUID(),
                cpf      : "159.235.225-96", 
                name     : "user test", 
                password : await User.buildPasswordHashed("123456"), 
                role     : "ADMIN"
            })
        )

        const uuid = randomUUID()
        inMemoryUsersRepository.users.push(
            User.create({
                id       : uuid,
                cpf      : "123.456.789-10", 
                name     : "user test", 
                password : await User.buildPasswordHashed("123456"), 
                role     : "ADMIN"
            })
        )

        const response = await sut.execute({
            cpf: User.buildCpf("159.235.225-96"), 
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(CpfAlreadyExistsError)
        expect(response.value).toMatchObject({
            statusCode: 409
        })
    })

    it(`shouldn't be able to update the cpf if it has less or more than 6 characters`, async () => {
        const uuid = randomUUID()

        inMemoryUsersRepository.users.push(
            User.create({
                id       : uuid,
                cpf      : "159.235.225-96610", 
                name     : "user test", 
                password : await User.buildPasswordHashed("123456"), 
                role     : "ADMIN"
            })
        )

        const response = await sut.execute({
            cpf: User.buildCpf("159.235.225-96610"), 
        }, uuid)

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidCpfError)
        expect(response.value).toMatchObject({
            statusCode: 400
        })
    })

    it(`should be able to update an user`, async () => {
        const uuid = randomUUID()
        inMemoryUsersRepository.users.push(
            User.create({
                id       : uuid,
                cpf      : "159.235.225-96", 
                name     : "user test", 
                password : await User.buildPasswordHashed("123456"), 
                role     : "ADMIN"
            })
        )

        const response = await sut.execute({
            cpf         : User.buildCpf("159.159.159-10"), 
            name        : "Usuário Teste", 
            password    : await User.buildPasswordHashed("1234567"), 
            old_password: "123456", 
            role        : "DELIVERY-PEOPLE"
        }, uuid)


        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
                user : {
                    cpf         : User.buildCpf("159.159.159-10"), 
                    name        : "Usuário Teste", 
                    role        : "DELIVERY-PEOPLE"
                }
        })

        expect(await compare("123456", inMemoryUsersRepository.users[0].password)).toBe(false)
    })
})