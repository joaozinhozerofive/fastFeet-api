import { UniqueEntityUUID } from "../types/random-uuid.js"

export abstract class Entity<Props> {
    protected _props : Props

    constructor(props: Props) {
        this._props = props 
    }
    
    get props() : Props {
        return this._props
    }
}