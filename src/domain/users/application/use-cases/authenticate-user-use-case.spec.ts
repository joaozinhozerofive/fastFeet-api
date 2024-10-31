import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js"
import { AuthenticateUserUseCase } from "./authenticate-user-use-case.js"
import { User } from "../../enterprise/entities/entity-user.js"
import { InvalidSessionCredentialsError } from "../../../../core/errors/invalid-credentials-session.js";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it('should be able to authenticate an user with cpf and password', async () => {
        const cpf            = "159.235.225-96"
        const name           = "user test"
        const password       = "123456"
        const role           = "ADMIN"
        const passwordHashed = await User.buildPasswordHashed(password)
        
        const user = User.create({
            cpf, 
            name, 
            password : passwordHashed, 
            role
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({ cpf, password })

        expect(response.value).toMatchObject({
            user : {
                cpf : user.cpf, 
                name : user.name, 
                password : user.password, 
                role : user.role
            }
        })
    })

    it("shouldn't be able to authenticate an user by invalid credentials (non-existent cpf)", async() => {
        const cpf            = "159.235.225-96"
        const password       = "123456"

        const response = await sut.execute({ cpf, password })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidSessionCredentialsError)
        expect(response.value).toMatchObject({
            statusCode : 401
        })
    })

    it("shouldn't be able to authenticate an user by invalid credentials (invalid password)", async() => {
        const cpf            = "159.235.225-96"
        const name           = "user test"
        const password       = "123456"
        const role           = "ADMIN"
        const passwordHashed = await User.buildPasswordHashed(password)

        const user = User.create({
            cpf, 
            name, 
            password : passwordHashed, 
            role
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({ cpf, password : "1234567" })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(InvalidSessionCredentialsError)
        expect(response.value).toMatchObject({
            statusCode : 401
        })
    })
})