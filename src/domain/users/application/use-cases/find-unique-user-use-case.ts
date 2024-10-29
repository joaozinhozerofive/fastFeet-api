import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { Either, left, right } from "@/core/either.js";
import { UserNotFoundError } from "../../../../core/errors/user-not-found-error.js";
import { User } from "../../enterprise/entities/entity-user.js";

interface FindUniqueUserUseCaseRequest {
    id: UniqueEntityUUID
}

type FindUniqueUserUseCaseResponse = Either<
    UserNotFoundError, 
    {
        user : User
    }
>

export class FindUniqueUserUseCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute(data: FindUniqueUserUseCaseRequest) : Promise<FindUniqueUserUseCaseResponse> {
        const user = await this.usersRepository.findById(data.id)

        if(!user) return left(new UserNotFoundError())

        return right({
            user
        })    
    }
}