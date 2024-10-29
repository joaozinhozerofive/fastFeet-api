import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FindUniqueUserUseCase } from "./find-unique-user-use-case.js";
import { User } from "../../enterprise/entities/entity-user.js";
import { randomUUID } from "crypto"
import { UserNotFoundError } from "../../../../core/errors/user-not-found-error.js";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FindUniqueUserUseCase

describe('Find an User by id', async() => {
    beforeEach(() => {
        inMemoryUsersRepository =  new InMemoryUsersRepository()
        sut = new FindUniqueUserUseCase(inMemoryUsersRepository)
    })

    it('should be able to find an user by id', async () => {
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
            id: uuid
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            user : {
                id: uuid, 
                cpf: user.cpf, 
                name: user.name, 
                password: user.password, 
                role: user.role
            }
        })
    })

    it(`shouldn't be able to find an user by id if user not exists`, async () => {
        const uuid = randomUUID()
        const response = await sut.execute({
            id: uuid
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(UserNotFoundError)
    })
})