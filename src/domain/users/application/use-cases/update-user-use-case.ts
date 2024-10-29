import { Optional } from "@/core/types/optional.js";
import { User, UserProps } from "../../enterprise/entities/entity-user.js";
import { UsersRepository } from "../repositories/users-repository.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { UserNotFoundError } from "../../../../core/errors/user-not-found-error.js";
import { Either, left, right } from "@/core/either.js";
import { compare, hash } from "bcryptjs";
import { InvalidPasswordError } from "../../../../core/errors/invalid-password-error.js";
import { CpfAlreadyExistsError } from "../../../../core/errors/cpf-already-exists.js";
import { PasswordWithInvalidNumberOfCharactersError } from "../../../../core/errors/password-with-invalid-number-of-characters-error.js";
import { UserPropsOptional } from "@/core/types/user-props-optional.js";
import { NameWithInvalidNumberOfCharactersError } from "../../../../core/errors/name-with-invalid-number-of-characters-error.js";
import { InvalidCpfError } from "@/core/errors/invalid-cpf.js";


interface UpdateUserUseCaseDataRequest extends UserProps{
    old_password?: string
}

type UpdateUserUseCaseResponse = Either<
    UserNotFoundError | InvalidPasswordError | CpfAlreadyExistsError | 
    PasswordWithInvalidNumberOfCharactersError | NameWithInvalidNumberOfCharactersError |
    InvalidCpfError, 
    {
        user: User
    }
>

export class UpdateUserUseCase {
    constructor(
        private usersRepository : UsersRepository
    ) {}

    async execute(data: Optional<UpdateUserUseCaseDataRequest, UserPropsOptional>, id: UniqueEntityUUID) : Promise<UpdateUserUseCaseResponse> {
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
            if(User.isInvalidCpf(data.cpf)) return left(new InvalidCpfError())
        }

        const userUpdated = await this.usersRepository.update(
            User.create({
            id,
            cpf: data.cpf || user.cpf, 
            name: data.name || user.name, 
            password: data.password ? await User.buildPasswordHashed(data.password) : user.password, 
            role: data.role || user.role
        }))

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