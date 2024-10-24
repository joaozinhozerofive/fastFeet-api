import { Entity } from "@/core/entities/entity.js"
import { EntityUUID } from "@/core/types/random-uuid.js"

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