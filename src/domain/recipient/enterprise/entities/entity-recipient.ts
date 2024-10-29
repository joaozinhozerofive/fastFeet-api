import { Entity } from "@/core/entities/entity.js";
import { PersonEntity } from "@/core/entities/person-entity.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";

export interface RecipientProps {
    id?           : UniqueEntityUUID
    name          : string
    cpf           : string 
    phone_number? : string
}

export type RecipientPropsOptional = 'id' | 'name' | 'cpf' | 'phone_number'

export class Recipient extends PersonEntity<RecipientProps> {
    constructor(props: RecipientProps) {
        super(Recipient.buildProps(props))
    }

    static buildProps(props: RecipientProps) {
        props.cpf = Recipient.buildCpf(props.cpf)

        return props 
    }

    get id() {
        return this._props.id
    }

    get name() {
        return this._props.name
    }

    get cpf() {
        return this._props.cpf
    }

    get phone_number() {
        return this._props.phone_number
    }

    set cpf(cpf: string) {
        this._props.cpf = cpf
    }

    static create(props: RecipientProps) {
        return new Recipient(props)
    }
}