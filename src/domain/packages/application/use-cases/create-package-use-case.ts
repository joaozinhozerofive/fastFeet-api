import { Package, StatusPackage } from "../../enterprise/entities/entity-package.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { RecipientRepository } from "@/domain/recipient/application/repositories/recipient-repository.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { Either, left, right } from "@/core/either.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js";
import { InvalidStatusPackageError } from "@/core/errors/invalid-status-package-error.js";
import { InvalidLengthStreetNameError } from "@/core/errors/invalid-length-street-name-error.js";
import { InvalidLengthNeighborhoodError } from "@/core/errors/invalid-length-neighborhood-error.js";
import { InvalidLengthCityError } from "@/core/errors/invalid-length-city-error.js";
import { StateIsRequiredError } from "@/core/errors/state-is-required-error.js";
import { InvalidLengthCepError } from "@/core/errors/invalid-length-cep-error.js";

interface CreatePackageUseCaseRequest {
    status?         : StatusPackage
    recipientId     : UniqueEntityUUID
    userId          : UniqueEntityUUID
    street_name     : string 
    residence_code  : number
    complement      : string
    cep             : string
    neighborhood    : string
    city            : string
    state           : string 
}

type CreatePackageUseCaseResponse = Either<
    RecipientNotFoundError | UserNotFoundError, 
    {
        package: Package
    }
>

export class CreatePackageUseCase {
    constructor(
        private packageRepository   : PackageRepository, 
        private usersRepository     : UsersRepository, 
        private recipientRepository : RecipientRepository
    ){}

    async execute(data: CreatePackageUseCaseRequest) : Promise<CreatePackageUseCaseResponse> {
        const recipient = await this.recipientRepository.findById(data.recipientId)

        if(!recipient) return left(new RecipientNotFoundError())

        const user = await this.usersRepository.findById(data.userId)
        
        if(!user) return left(new UserNotFoundError())

        const newPackage = Package.create({
            ...data, 
            recipient, 
            user
        })

        if(newPackage.status && ![1, 2, 3, 4].includes(newPackage.status)) return left(new InvalidStatusPackageError())

        if(!Package.isStreetNameWithValidNumberOfCharacter(newPackage.street_name)) return left(new InvalidLengthStreetNameError())
            
        if(!Package.isNeighborhoodWithValidNumberOfCharacter(newPackage.neighborhood)) return left(new InvalidLengthNeighborhoodError())

        if(!Package.isCityWithValidNumberOfCharacter(newPackage.city)) return left(new InvalidLengthCityError())

        if(!newPackage.state) return left(new StateIsRequiredError())

        if(!Package.isCepWithvalidNumberOfCharacter(newPackage.cep)) return left(new InvalidLengthCepError())

        const packageCreated = await this.packageRepository.create(newPackage) 

        return right({
            package: packageCreated
        })
    }
}