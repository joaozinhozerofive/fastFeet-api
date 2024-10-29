import { PersonEntity } from "@/core/entities/person-entity.js"
import { UniqueEntityUUID } from "@/core/types/random-uuid.js"
import { hash } from "bcryptjs"
import { randomUUID } from "crypto" 

export interface UserProps{
    id?      : UniqueEntityUUID
    cpf      : string 
    password : string 
    name     : string 
    role     : 'ADMIN' | 'DELIVERY-PEOPLE'
}

export class User extends PersonEntity<UserProps>{
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

    static buildProps(props : UserProps) {
        props.cpf = User.buildCpf(props.cpf)

        return props
    }

    static isPasswordWithValidNumberOfCharacters(password: string) {
        return password.length >= 6
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