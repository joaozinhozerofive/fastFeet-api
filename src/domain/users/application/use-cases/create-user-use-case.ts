import { Either, left, right } from "@/core/either.js";
import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { User, UserProps } from "../../enterprise/entities/entity-user.js";
import { CpfAlreadyExistsError } from "../../../../core/errors/cpf-already-exists.js";
import { InvalidCpfError } from "../../../../core/errors/invalid-cpf.js";
import { PasswordWithInvalidNumberOfCharactersError } from "../../../../core/errors/password-with-invalid-number-of-characters-error.js";
import { NameWithInvalidNumberOfCharactersError } from "../../../../core/errors/name-with-invalid-number-of-characters-error.js";

interface CreateUserRequest extends UserProps {}

type CreateUserResponse = Either<
    CpfAlreadyExistsError | InvalidCpfError | PasswordWithInvalidNumberOfCharactersError,
    {
        user : User
    }
>

export class CreateUserUseCase {
    constructor(
        private usersRepository : UsersRepository
    ) {}

    async execute(data: CreateUserRequest) : Promise<CreateUserResponse> {
        const userFromCpf = await this.usersRepository.findByCpf(data.cpf);

        if(userFromCpf) return left(new CpfAlreadyExistsError())

        if(!User.isPasswordWithValidNumberOfCharacters(data.password)) return left(new PasswordWithInvalidNumberOfCharactersError()) 
            
        if(!User.isNameWithvalidNumberOfCharacter(data.name)) return left(new NameWithInvalidNumberOfCharactersError())    

        data = await CreateUserUseCase.buildData(data)

        const user = User.create(data)

        if(User.isInvalidCpf(user.cpf)) return left(new InvalidCpfError())

        const userCreated = await this.usersRepository.create(user)

        return right({user: userCreated})
    }

    private static async buildData(data: CreateUserRequest) {
        const passwordHashed = await User.buildPasswordHashed(data.password)

        data.password = passwordHashed

        return data
    }
}