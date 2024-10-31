import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { Either, left, right } from "@/core/either.js";
import { Package } from "../../enterprise/entities/entity-package.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { RecipientRepository } from "@/domain/recipient/application/repositories/recipient-repository.js";

interface FindManyPackagesByRecipientIdUseCaseRequest {
    recipientId: UniqueEntityUUID
}

type FindManyPackagesByRecipientIdUseCaseResponse =  Either<
    RecipientNotFoundError, 
    {
        packages: Package[]
    }
>

export class FindManyPackagesByRecipientIdUseCase {
    constructor(
        private packageRepository: PackageRepository,
        private recipientRepository  : RecipientRepository
    ){}

    async execute(data: FindManyPackagesByRecipientIdUseCaseRequest) : Promise<FindManyPackagesByRecipientIdUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(data.recipientId)

        if(!recipient) return left(new RecipientNotFoundError())

        const packages = await this.packageRepository.findManyByRecipientId(data.recipientId)

        return right({
            packages
        })
    }
}