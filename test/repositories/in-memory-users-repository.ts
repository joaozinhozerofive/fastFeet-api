import { User, UserProps } from "@/domain/users/enterprise/entities/entity-user.js"
import { UsersRepository } from "../../src/domain/users/application/repositories/users-repository.js"
import { UniqueEntityUUID } from "@/core/types/random-uuid.js"
import { Optional } from "@/core/types/optional.js"
import { UserPropsOptional } from "@/core/types/user-props-optional.js"

export class InMemoryUsersRepository implements UsersRepository {    
    public users : User[] = []
    async create(data: User): Promise<User> {
        this.users.push(data)
        
        return data
    }

    async findByCpf(cpf: String): Promise<User | null> {
        return this.users.find(user => user.cpf === cpf) || null
    }

    async findById(id: UniqueEntityUUID): Promise<User | null> {
        return this.users.find(user => user.id === id) || null
    }

    async update(data: User): Promise<User> {
        const index = this.users.findIndex(user => user.id === data.id)
        
        if(index < 0) return this.users[0]
        this.users[index] = data

        return data
    }

    async findManyNearBy(params: Optional<UserProps, UserPropsOptional>): Promise<User[] | null> {
        let user = this.users.filter(user => {
            for(const key in params) {
                if((params as any)[key]) {
                    const userValue  = String((user as any)[key]).toLowerCase()
                    const paramValue = String((params as any)[key]).toLowerCase()

                    return userValue.includes(paramValue) 
                }
            }
        })

        return user
    }

    async delete(user: User): Promise<void> {
        const userFromId = this.users.find(data => data.id === user.id)
        
        if(user) {
            this.users = this.users.filter(newUser => newUser.id != user.id)
        }
    }
} 