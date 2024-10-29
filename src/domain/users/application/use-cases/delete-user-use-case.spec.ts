import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { User } from "../../enterprise/entities/entity-user.js";
import { randomUUID } from "crypto"
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js";
import { DeleteUserUseCase } from "./delete-user-use-case.js";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Find an User by id', async() => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new DeleteUserUseCase(inMemoryUsersRepository)
    })

    it('should be able to delete an user by id', async () => {
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
        expect(inMemoryUsersRepository.users).toHaveLength(0)
    })

    it(`shouldn't  to delete an user by id if user not exists`, async () => {
        const uuid = randomUUID()
        const response = await sut.execute({
            id: uuid
        })

        expect(response.isLeft()).toBe(true)
        expect(response.value).instanceOf(UserNotFoundError)
    })
})