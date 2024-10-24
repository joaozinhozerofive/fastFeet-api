import { Either, left, right } from "@/core/either.js";
import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { hash } from 'bcryptjs';
import { User, UserProps } from "../../enterprise/entities/entity-user.js";
import { CpfAlreadyExistsError } from "../../errors/cpf-already-exists.js";
import { InvalidCpfError } from "../../errors/invalid-cpf.js";

interface CreateUserRequest extends UserProps {}

type CreateUserResponse = Either<
    CpfAlreadyExistsError | InvalidCpfError,
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

        data = await CreateUserUseCase.buildData(data)

        const user = User.create(data)

        if(user.cpf.length !== 11) return left(new InvalidCpfError())

        const userCreated = await this.usersRepository.create(user)

        return right({user: userCreated})
    }

    private static async buildData(data: CreateUserRequest) {
        const passwordHashed = await hash(data.password, 8)

        data.password = passwordHashed

        return data
    }
}