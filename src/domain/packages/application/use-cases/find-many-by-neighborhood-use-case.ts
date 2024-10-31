import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { Either, left, right } from "@/core/either.js";
import { PackageNotFoundError } from "@/core/errors/package-not-found-error.js";
import { Package } from "../../enterprise/entities/entity-package.js";

interface FindManyPackagesByNeighborhoodUseCaseRequest {
    neighborhood: string
}

type FindManyPackagesByNeighborhoodUseCaseResponse = Either<
    null, 
    {
        packages: Package[] 
    }
>

export class FindManyPackagesByNeighborhoodUseCase {
    constructor(
        private packageRepository: PackageRepository
    ){}

    async execute(data: FindManyPackagesByNeighborhoodUseCaseRequest) : Promise<FindManyPackagesByNeighborhoodUseCaseResponse> {
        const packages =  await this.packageRepository.findManyByNeighborhood(data.neighborhood)

        return right({
            packages
        })    
    }
}