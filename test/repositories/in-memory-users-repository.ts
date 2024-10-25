import { User, UserProps } from "@/domain/users/enterprise/entities/entity-user.js"
import { UsersRepository } from "../../src/domain/users/application/repositories/users-repository.js"
import { EntityUUID } from "@/core/types/random-uuid.js"
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

    async findById(id: EntityUUID): Promise<User | null> {
        return this.users.find(user => user.id === id) || null
    }

    async update(data: Optional<UserProps, UserPropsOptional>, id: EntityUUID): Promise<User> {
        const user = await this.findById(id)

        if(!user) return this.users[0]

        for(const key in data) {
            if((data as any)[key]) {
                (user as any).props[key] = (data as any)[key]
            }
        }

        return await this.findById(id) || this.users[0]
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

    async deleteById(id: EntityUUID): Promise<void> {
        const user = this.users.find(user => user.id === id)
        
        if(user) {
            this.users = this.users.filter(newUser => newUser.id != user.id)
        }
    }
} 