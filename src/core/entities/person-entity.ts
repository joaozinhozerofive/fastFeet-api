import { Entity } from "./entity.js"

export abstract class PersonEntity<Props> extends Entity<Props> {
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