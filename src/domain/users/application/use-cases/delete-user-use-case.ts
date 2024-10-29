import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { Either, left, right } from "@/core/either.js";
import { UserNotFoundError } from "../../../../core/errors/user-not-found-error.js";
import { User } from "../../enterprise/entities/entity-user.js";

interface DeleteUserUseCaseRequest {
    id: UniqueEntityUUID
}

type DeleteUserUseCaseResponse = Either<
    UserNotFoundError, 
    null
>

export class DeleteUserUseCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute(data: DeleteUserUseCaseRequest) : Promise<DeleteUserUseCaseResponse> {
        const user = await this.usersRepository.findById(data.id)

        if(!user) return left(new UserNotFoundError())

        await this.usersRepository.deleteById(data.id)    

        return right(null)    
    }
}