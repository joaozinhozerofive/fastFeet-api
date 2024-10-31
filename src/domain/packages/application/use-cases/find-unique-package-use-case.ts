import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { Either, left, right } from "@/core/either.js";
import { PackageNotFoundError } from "@/core/errors/package-not-found-error.js";
import { Package } from "../../enterprise/entities/entity-package.js";

interface FindUniquePackageUseCaseRequest {
    id: UniqueEntityUUID
}

type FindUniquePackageUseCaseResponse = Either<
    PackageNotFoundError, 
    {
        package: Package 
    }
>

export class FindUniquePackageUseCase {
    constructor(
        private packageRepository: PackageRepository
    ){}

    async execute(data: FindUniquePackageUseCaseRequest) : Promise<FindUniquePackageUseCaseResponse> {
        const packageFromId = await this.packageRepository.findById(data.id)
        
        if(!packageFromId) return left(new PackageNotFoundError())

        return right({
            package: packageFromId
        })    
    }
}