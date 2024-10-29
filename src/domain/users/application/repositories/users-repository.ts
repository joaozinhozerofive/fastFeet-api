import { Optional } from "@/core/types/optional.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { UserPropsOptional } from "@/core/types/user-props-optional.js";
import { User, UserProps } from "@/domain/users/enterprise/entities/entity-user.js";

export interface UsersRepository {
    users: User[]
    findByCpf(cpf: String) : Promise<User | null>
    create(data : User) : Promise<User>
    findById(id: UniqueEntityUUID) : Promise<User | null>
    update(data: Optional<UserProps, UserPropsOptional>, id: UniqueEntityUUID) : Promise<User>
    findManyNearBy(params: Optional<UserProps, UserPropsOptional>) : Promise<User[] | null>
    deleteById(id: UniqueEntityUUID) : Promise<void>
}