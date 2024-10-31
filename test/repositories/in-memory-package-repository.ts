import { UniqueEntityUUID } from "@/core/types/random-uuid.js";
import { PackageRepository } from "@/domain/packages/application/repositories/package-repository.js";
import { Package } from "@/domain/packages/enterprise/entities/entity-package.js";

export class InMemoryPackageRepository implements PackageRepository {
    public packages : Package[] = []
    
    async create(data: Package): Promise<Package> {
        this.packages.push(data)
        return data
    }

    async delete(data: Package): Promise<void> {
        const packageToDelete = this.packages.find(packageData  => packageData.id === data.id)

        if(packageToDelete) {
            this.packages = this.packages.filter(data => data.id !== packageToDelete.id)
        }
    }

    async findById(id: UniqueEntityUUID): Promise<Package | null> {
        return this.packages.find(packageData  => packageData.id === id) || null
    }

    async findManyByNeighborhood(neighborhood: string): Promise<Package[]> {
        return this.packages.filter(packageData  => packageData.neighborhood.includes(neighborhood))
    }

    async findManyByUserId(user_id: UniqueEntityUUID): Promise<Package[]> {
        return this.packages.filter(packageData  => packageData.user.id === user_id)
    }

    async findManyByRecipientId(recipient_id: UniqueEntityUUID): Promise<Package[]> {
        return this.packages.filter(packageData  => packageData.recipient.id === recipient_id)
    }

    async update(data: Package): Promise<Package> {
        const index = this.packages.findIndex(packageData => packageData.id === data.id)

        if(index < 0) return this.packages[0]

        this.packages[index] = data

        return this.packages[index]
    }
}