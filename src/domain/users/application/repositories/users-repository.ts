import { Optional } from "@/core/types/optional.js";
import { EntityUUID } from "@/core/types/random-uuid.js";
import { UserPropsOptional } from "@/core/types/user-props-optional.js";
import { User, UserProps } from "@/domain/users/enterprise/entities/entity-user.js";

export interface UsersRepository {
    users: User[]
    findByCpf(cpf: String) : Promise<User | null>
    create(data : User) : Promise<User>
    findById(id: EntityUUID) : Promise<User | null>
    update(data: Optional<UserProps, UserPropsOptional>, id: EntityUUID) : Promise<User>
    findManyNearBy(params: Optional<UserProps, UserPropsOptional>) : Promise<User[] | null>
    deleteById(id: EntityUUID) : Promise<void>
}