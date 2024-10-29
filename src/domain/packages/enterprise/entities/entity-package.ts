import { Entity } from "@/core/entities/entity.js";
import { Optional } from "@/core/types/optional.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { Recipient } from "@/domain/recipient/enterprise/entities/entity-recipient.js";
import { User } from "@/domain/users/enterprise/entities/entity-user.js";

export interface PackageProps {
    id?             : UniqueEntityUUID
    status          : StatusPackage
    recipient       : Recipient
    user            : User
    street_name     : string 
    residence_code  : number
    complement      : string
    cep             : string
    neighborhood    : string
    city            : string
    state           : string 
}
       
export type PackagePropsOptional = 'status' |'recipient' | 'user' | 'street_name' | 'residence_code' | 'complement' | 'cep' | 'neighborhood' | 'city' | 'state'   

export enum StatusPackage {
    COLLECTED = 1, 
    PENDING   = 2, 
    DELIVERED = 3, 
    RETURNED  = 4        
}

export class Package extends Entity<PackageProps> {
    constructor(props: PackageProps) {
        super(Package.buildProps(props))
    }

    set status(status: StatusPackage) {
        this._props.status = status 
    }

    get status() {
        return this._props.status
    }

    get statusData() {
        return {
            statusCode : this._props.status, 
            statusName : Package.getStatusName(this._props.status)
        }
    }

    get recipient() {
        return this._props.recipient
    }

    get user() {
        return this._props.user
    }

    get street_name() {
        return this._props.street_name
    }

    get residence_code() {
        return this._props.residence_code
    }

    get complement() {
        return this._props.complement
    }

    get cep() {
        return this._props.cep
    }

    get neighborhood() {
        return this.props.neighborhood
    }

    get city() {
        return this._props.city
    }

    get state() {
        return this._props.state
    }

    get id() {
        return this._props.id
    }

    static getStatusName(statusCode: StatusPackage) {
        const statusNames = {
            [1] : 'COLLECTED', 
            [2] : 'PENDING', 
            [3] : 'DELIVERED', 
            [4] : 'RETURNED'
        }

        return statusNames[statusCode] 
    }

    static buildProps(props: PackageProps) {
        props.cep = Package.buildCep(props.cep)

        return props
    }

    static buildCep(cep: string) {
        cep = cep.replaceAll(".", "")
        cep = cep.replaceAll("-", "")

        return cep
    }

    static create(props: PackageProps) {
        return new Package(props)
    }

    static isStreetNameWithValidNumberOfCharacter(streetName: string) {
        return streetName.length >= 3 
    }

    static isNeighborhoodWithValidNumberOfCharacter(neighborhood: string) {
        return neighborhood.length >= 3 
    }

    static isCityWithValidNumberOfCharacter(city: string) {
        return city.length >= 3 
    }

    static isCepWithvalidNumberOfCharacter(cep: string) {
        return cep.length !== 8
    }
}