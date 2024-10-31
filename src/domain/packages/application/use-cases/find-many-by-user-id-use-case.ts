import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { Either, left, right } from "@/core/either.js";
import { Package } from "../../enterprise/entities/entity-package.js";
import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js";

interface FindManyPackagesByUserIdUseCaseRequest {
    userId: UniqueEntityUUID
}

type FindManyPackagesByUserIdUseCaseResponse =  Either<
    UserNotFoundError, 
    {
        packages: Package[]
    }
>

export class FindManyPackagesByUserIdUseCase {
    constructor(
        private packageRepository: PackageRepository,
        private usersRepository  : UsersRepository
    ){}

    async execute(data: FindManyPackagesByUserIdUseCaseRequest) : Promise<FindManyPackagesByUserIdUseCaseResponse> {
        const user = await this.usersRepository.findById(data.userId)

        if(!user) return left(new UserNotFoundError())

        const packages = await this.packageRepository.findManyByUserId(data.userId)

        return right({
            packages
        })
    }
}