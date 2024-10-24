import { User } from "@/domain/users/enterprise/entities/entity-user.js"
import { UsersRepository } from "../../src/domain/users/application/repositories/users-repository.js"

export class InMemoryUsersRepository implements UsersRepository {    
    public users : User[] = []
    async create(data: User): Promise<User> {
        this.users.push(data)
        
        return data
    }

    async findByCpf(cpf: String): Promise<User | null> {
        return this.users.find(user => user.props.cpf === cpf) || null
    }
}