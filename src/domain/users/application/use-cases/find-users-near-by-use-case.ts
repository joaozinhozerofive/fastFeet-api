import { Optional } from "@/core/types/optional.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { User, UserProps } from "../../enterprise/entities/entity-user.js";
import { UserPropsOptional } from "@/core/types/user-props-optional.js";
import { Either, right } from "@/core/either.js";

type FindUserNearByUseCaseResponse = Either<
    null, 
    {
        users : User[] | null
    }
>

export class FindUsersNearByUseCase {
    constructor(
        private usersRepository :  UsersRepository
    ) {}

    async execute(params: Optional<UserProps, UserPropsOptional>) : Promise<FindUserNearByUseCaseResponse> {
        const users = await this.usersRepository.findManyNearBy(params)

        return right({
            users
        })
    }
}