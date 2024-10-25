import { Entity } from "@/core/entities/entity.js"
import { EntityUUID } from "@/core/types/random-uuid.js"
import { hash } from "bcryptjs"
import { randomUUID } from "crypto" 

export interface UserProps{
    id?      : EntityUUID
    cpf      : string 
    password : string 
    name     : string 
    role     : 'ADMIN' | 'DELIVERY-PEOPLE'
}

export class User extends Entity<UserProps>{
    constructor(props : UserProps) {
        super(User.buildProps(props))
    }

    get cpf() {
        return this._props.cpf
    }

    get password() {
        return this._props.password
    }
    
    get id() {
        return this._props.id
    }

    get name() {
        return this._props.name
    }

    get role() {
        return this._props.role
    }

    get props() {
        return this._props
    }

    static buildProps(props : UserProps) {
        props.cpf = User.buildCpf(props.cpf)

        return props
    }

    static buildCpf(cpf: string) {
        cpf = cpf.replaceAll(".", "")
        cpf = cpf.replaceAll("-", "")

        return cpf
    }

    static isPasswordWithValidNumberOfCharacters(password: string) {
        return password.length >= 6
    }

    static isNameWithvalidNumberOfCharacter(name: string) {
        const nameWithoutSpace = name.split(" ").join('')
        return nameWithoutSpace.length >= 6
    }

    static async buildPasswordHashed(password: string) {
        return await hash(password, 8)
    }

    isAdmin() {
        return this._props.role === "ADMIN"
    }

    isDeliveryPeople() {
        return this._props.role === "DELIVERY-PEOPLE"
    }

    static create(props : UserProps) {
        const user = new User(props)

        return user
    }
}