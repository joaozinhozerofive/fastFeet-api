import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { PackageRepository } from "../repositories/package-repository.js";
import { RecipientRepository } from "@/domain/recipient/application/repositories/recipient-repository.js";
import { Optional } from "@/core/types/optional.js";
import { Package, PackageProps, PackagePropsOptional, StatusPackage } from "../../enterprise/entities/entity-package.js";
import { Either, left, right } from "@/core/either.js";
import { StateIsRequiredError } from "@/core/errors/state-is-required-error.js";
import { RecipientNotFoundError } from "@/core/errors/recipient-not-found-error.js";
import { UserNotFoundError } from "@/core/errors/user-not-found-error.js";
import { InvalidStatusPackageError } from "@/core/errors/invalid-status-package-error.js";
import { InvalidLengthStreetNameError } from "@/core/errors/invalid-length-street-name-error.js";
import { InvalidLengthNeighborhoodError } from "@/core/errors/invalid-length-neighborhood-error.js";
import { InvalidLengthCityError } from "@/core/errors/invalid-length-city-error.js";
import { InvalidLengthCepError } from "@/core/errors/invalid-length-cep-error.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageNotFoundError } from "@/core/errors/package-not-found-error.js";
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js";
import { User } from "@/domain/users/enterprise/entities/entity-user.js";

interface UpdatePackageUseCaseRequest {
    status?        : StatusPackage
    recipientId?   : UniqueEntityUUID
    userId?        : UniqueEntityUUID
    street_name?   : string 
    residence_code?: number
    complement?    : string
    cep?           : string
    neighborhood?  : string
    city?          : string
    state?         : string 
}

type UpdatePackageUseCaseResponse = Either<
    StateIsRequiredError | RecipientNotFoundError | InvalidStatusPackageError | InvalidLengthCepError |
    InvalidLengthStreetNameError | InvalidLengthNeighborhoodError | InvalidLengthCityError | PackageNotFoundError  , 
    {
        package: Package
    }
>

export class UpdatePackageUseCase {
    constructor(
        private packageRepository   : PackageRepository, 
        private usersRepository     : UsersRepository, 
        private recipientRepository : RecipientRepository
    ){}


    async execute(data: UpdatePackageUseCaseRequest, id: UniqueEntityUUID) : Promise<UpdatePackageUseCaseResponse> {
        data = UpdatePackageUseCase.buildData(data)

        const packageToUpdate = await this.packageRepository.findById(id)
        
        if(!packageToUpdate) return left(new PackageNotFoundError)

        let recipient : Recipient | null = null  

        if(data.recipientId){
            recipient = await this.recipientRepository.findById(data.recipientId)    
            if(!recipient)return left(new RecipientNotFoundError())
        } 

        let user: User | null = null

        if(data.userId){
            user = await this.usersRepository.findById(data.userId) 
            if(!user) return left(new UserNotFoundError())
        } 

        if(data.status && ![1, 2, 3, 4].includes(data.status)) return left(new InvalidStatusPackageError())

        if(data.street_name && !Package.isStreetNameWithValidNumberOfCharacter(data.street_name)) return left(new InvalidLengthStreetNameError())
            
        if(data.neighborhood && !Package.isNeighborhoodWithValidNumberOfCharacter(data.neighborhood)) return left(new InvalidLengthNeighborhoodError())

        if(data.city && !Package.isCityWithValidNumberOfCharacter(data.city)) return left(new InvalidLengthCityError())

        if(data.state !== undefined && !data.state) return left(new StateIsRequiredError())

        if(data.cep && !Package.isCepWithvalidNumberOfCharacter(data.cep)) return left(new InvalidLengthCepError())

        const packageUpdated = await this.packageRepository.update(
            Package.create({
                id,
                cep: data.cep || packageToUpdate.cep, 
                city: data.city || packageToUpdate.city, 
                complement: data.complement || packageToUpdate.complement,
                neighborhood : data.neighborhood || packageToUpdate.neighborhood,
                recipient : recipient || packageToUpdate.recipient,
                user : user || packageToUpdate.user,
                residence_code: data.residence_code || packageToUpdate.residence_code, 
                state: data.state ?? packageToUpdate.state, 
                street_name: data.street_name || packageToUpdate.street_name, 
                status: data.status || packageToUpdate.status
            })
        )    

        return right({
            package: packageUpdated
        })
    }

    private static buildData(data: UpdatePackageUseCaseRequest) {
        if(data.cep) data.cep = Package.buildCep(data.cep)

        return data
    }
}