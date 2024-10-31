import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { Either, left, right } from "@/core/either.js";
import { PackageNotFoundError } from "@/core/errors/package-not-found-error.js";

interface DeletePackageUseCaseRequest {
    id: UniqueEntityUUID
}

type DeletePackageUseCaseResponse =  Either<
    PackageNotFoundError,
    null
>

export class DeletePackageUseCase{
    constructor(
        private packageRepository: PackageRepository
    ){}

    async execute(data: DeletePackageUseCaseRequest) : Promise<DeletePackageUseCaseResponse> {
        const pack = await this.packageRepository.findById(data.id)

        if(!pack) return left(new PackageNotFoundError)

        await this.packageRepository.delete(pack)
        
        return right(null)
    } 
}