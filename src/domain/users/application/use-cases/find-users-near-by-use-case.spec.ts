import { describe, beforeEach, it, expect } from "vitest";
import { FindUsersNearByUseCase } from "./find-users-near-by-use-case.js";
import { InMemoryUsersRepository } from "@test/repositories/in-memory-users-repository.js";
import { randomUUID } from "crypto"
import { User } from "../../enterprise/entities/entity-user.js";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FindUsersNearByUseCase

describe('Find Many Users By Params', async () =>{
    beforeEach(() => {
        inMemoryUsersRepository =  new InMemoryUsersRepository()
        sut = new FindUsersNearByUseCase(inMemoryUsersRepository)
    })

    it('should be able to get users by id', async () => {
        const user = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-10", 
            name     : "Usuário do teste", 
            password : await User.buildPasswordHashed("123456"), 
            role     :"ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            id: user.id
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            users: [
                expect.objectContaining({
                    id  : user.id,
                    cpf : user.cpf, 
                    name: user.name, 
                    password: user.password,
                    role: user.role
                }), 
            ]
        })
    })  

    it('should be able to get users by cpf', async () => {
        const user = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-10", 
            name     : "Usuário do teste", 
            password : await User.buildPasswordHashed("123456"), 
            role     :"ADMIN"
        })

        inMemoryUsersRepository.users.push(user)

        const response = await sut.execute({
            cpf: user.cpf
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            users: [
                expect.objectContaining({
                    id  : user.id,
                    cpf : user.cpf, 
                    name: user.name, 
                    password: user.password,
                    role: user.role
                }), 
            ]
        })
    })

    it('should be able to get users by name', async () => {
        const userOne = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-10", 
            name     : "User test", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        const userTwo = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-20", 
            name     : "User jump of cat", 
            password : await User.buildPasswordHashed("1234567"), 
            role     : "DELIVERY-PEOPLE"
        })

        inMemoryUsersRepository.users.push(...[userOne, userTwo])

        const response = await sut.execute({
            name: "user"
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            users: [
                expect.objectContaining({
                    id  : userOne.id,
                    cpf : userOne.cpf, 
                    name: userOne.name, 
                    password: userOne.password,
                    role: userOne.role
                }),
                expect.objectContaining({
                    id  : userTwo.id,
                    cpf : userTwo.cpf, 
                    name: userTwo.name, 
                    password: userTwo.password,
                    role: userTwo.role
                }), 
            ]
        })
    })

    it('should be able to get users by role', async () => {
        const userOne = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-10", 
            name     : "User test", 
            password : await User.buildPasswordHashed("123456"), 
            role     : "ADMIN"
        })

        const userTwo = User.create({
            id       : randomUUID() , 
            cpf      : "156.156.156-20", 
            name     : "User jump of cat", 
            password : await User.buildPasswordHashed("1234567"), 
            role     : "DELIVERY-PEOPLE"
        })

        inMemoryUsersRepository.users.push(...[userOne, userTwo])

        const response = await sut.execute({
            role: "ADMIN"
        })

        expect(response.isRight()).toBe(true)
        expect(response.value).toMatchObject({
            users: [
                expect.objectContaining({
                    id  : userOne.id,
                    cpf : userOne.cpf, 
                    name: userOne.name, 
                    password: userOne.password, 
                    role: userOne.role
                })
            ]
        })
    })
})