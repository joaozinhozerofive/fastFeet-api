import { Entity } from "@/core/entities/entity.js";
import { UniqueEntityUUID } from "@/core/types/random-uuid.js";

export interface PackageProps {
    id             : UniqueEntityUUID
    status         : StatusPackage
    recipient      : any
    street_name    : string 
    residence_code : number
    complement     : string
    cep            : string
    neighborhood   : string
    city           : string
    state          : string 
}

enum StatusPackage {
    COLLECTED = 1, 
    PENDING   = 2, 
    DELIVERED = 3, 
    RETURNED  = 4        
}

export class Package extends Entity<PackageProps> {
    private static getStatusName(statusCode: StatusPackage) {
        const statusNames = {
            [1] : 'COLLECTED', 
            [2] : 'PENDING', 
            [3] : 'DELIVERED', 
            [4] : 'RETURNED'
        }

        return statusNames[statusCode] 
    }

    get status() {
        return {
            statusCode : this._props.status, 
            statusName : Package.getStatusName(this._props.status)
        }
    }
}