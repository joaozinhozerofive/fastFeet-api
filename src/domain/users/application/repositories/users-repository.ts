import { User } from "@/domain/users/enterprise/entities/entity-user.js";

export interface UsersRepository {
    users: User[]
    findByCpf(cpf: String) : Promise<User | null>
    create(data : User) : Promise<User>
}