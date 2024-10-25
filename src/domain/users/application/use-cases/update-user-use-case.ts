import { Optional } from "@/core/types/optional.js";
import { User, UserProps } from "../../enterprise/entities/entity-user.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { EntityUUID } from "@/core/types/random-uuid.js";
import { UserNotFoundError } from "../../errors/user-not-found-error.js";
import { Either, left, right } from "@/core/either.js";
import { compare } from "bcryptjs";
import { InvalidPasswordError } from "../../errors/invalid-password-error.js";
import { CpfAlreadyExistsError } from "../../errors/cpf-already-exists.js";
import { PasswordWithInvalidNumberOfCharactersError } from "../../errors/password-with-invalid-number-of-characters-error.js";
import { UserPropsOptional } from "@/core/types/user-props-optional.js";
import { NameWithInvalidNumberOfCharactersError } from "../../errors/name-with-invalid-number-of-characters-error.js";


interface UpdateUserUseCaseDataRequest extends UserProps{
    old_password?: string
}

type UpdateUserUseCaseResponse = Either<
    UserNotFoundError | InvalidPasswordError | CpfAlreadyExistsError | PasswordWithInvalidNumberOfCharactersError | NameWithInvalidNumberOfCharactersError, 
    {
        user: User
    }
>

export class UpdateUserUseCase {
    constructor(
        private usersRepository : UsersRepository
    ) {}

    async execute(data : Optional<UpdateUserUseCaseDataRequest, UserPropsOptional>, id: EntityUUID) : Promise<UpdateUserUseCaseResponse> {
        const user = await this.usersRepository.findById(id)

        if(!user) return left(new UserNotFoundError())
            
        if(data.password && !data.old_password) return left(new InvalidPasswordError())
        
        if(data.password && !User.isPasswordWithValidNumberOfCharacters(data.password)) 
            return left(new PasswordWithInvalidNumberOfCharactersError())   

        if(data.name && !User.isNameWithvalidNumberOfCharacter(data.name))
            return left(new NameWithInvalidNumberOfCharactersError())

        if(data.password && data.old_password) {
            if(!await this.isPasswordsMatched(data.old_password, user.password)) return left(new InvalidPasswordError())
        }

        if(data.cpf) {
            if(await this.existsOtherUserWithCpf(data.cpf, user)) return left(new CpfAlreadyExistsError())
        }

        const userUpdated = await this.usersRepository.update(data, id)

        return right({
            user : userUpdated
        })
    }

    private async existsOtherUserWithCpf(cpf: string, user: User) {
        const userAlreadyExistsByCpf = await this.usersRepository.findByCpf(cpf)
        return userAlreadyExistsByCpf && userAlreadyExistsByCpf.id !== user.id
    }

    private async isPasswordsMatched(old_password: string, new_password: string) {
        return await compare(old_password, new_password)
    }
}