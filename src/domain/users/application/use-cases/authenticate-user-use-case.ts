import { Either, left, right } from "@/core/either.js";
import { UsersRepository } from "@/domain/users/application/repositories/users-repository.js";
import { User } from "../../enterprise/entities/entity-user.js";
import { InvalidSessionCredentialsError } from "../../../../core/errors/invalid-credentials-session.js";
import { compare } from "bcryptjs";

interface AuthenticateUserRequests {
    cpf: string, 
    password: string
}

type AuthenticateUserResponse = Either<
    InvalidSessionCredentialsError,
    {
        user : User
    }
>


export class AuthenticateUserUseCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute(props : AuthenticateUserRequests) : Promise<AuthenticateUserResponse> {
        let { cpf, password } =  props

        cpf = User.buildCpf(cpf)

        const user = await this.usersRepository.findByCpf(cpf)
        
        if(!user) return left(new InvalidSessionCredentialsError()) 

        const isPasswordsMatched = await compare(password, user.password) 

        if(!isPasswordsMatched) return left(new InvalidSessionCredentialsError()) 

        return right({
            user
        })
    }
}