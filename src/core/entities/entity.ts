import { UniqueEntityUUID } from "../types/random-uuid.js"

export abstract class Entity<Props> {
    protected _props : Props

    constructor(props: Props) {
        this._props = props 
    }
    
    get props() : Props {
        return this._props
    }

    static buildCpf(cpf: string) {
        cpf = cpf.replaceAll(".", "")
        cpf = cpf.replaceAll("-", "")

        return cpf
    }

    static isNameWithvalidNumberOfCharacter(name: string) {
        const nameWithoutSpace = name.split(" ").join('')
        return nameWithoutSpace.length >= 6
    }

    static isInvalidCpf(cpf: string) {
        return cpf.length !== 11
    }

}