import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { Package, PackageProps, PackagePropsOptional } from "../../enterprise/entities/entity-package.js";

export interface PackageRepository {
    create(data: Package) : Promise<Package>
    findById(id: UniqueEntityUUID) : Promise<Package | null>
    findManyByNeighborhood(neighborhood: string) : Promise<Package[]>
    findManyByUserId(user_id: UniqueEntityUUID) : Promise<Package[]>
    findManyByRecipientId(recipient_id: UniqueEntityUUID) : Promise<Package[]>
    update(data: Package) : Promise<Package>
    delete(data: Package) : Promise<void>  
}