import type { Prisma } from "#/generated/prisma/client";
import { db } from "#/lib/db";

export async function getUserByClerkId(clerkId: string) {
    return db.user.findUnique({
        where: { clerkId }
    })
}


export async function createUser(data: Prisma.UserCreateInput) {
    return db.user.create({ data })
}

export async function updateUserById(clerkId: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
        where: { clerkId },
        data
    })
}

export async function getUserData(clerkId: string) {
    return db.user.findUnique({
        where: { clerkId },
        include: {
           jobs: true,
           resume: true,
           applications: true
        }
    })
}

export async function updateUserToEmployer(clerkId: string, companyName: string, companySite: string) {
    return db.user.update({
        where: { clerkId },
        data: {
            role: "Employer",
            companyName,
            companySite,
        }
    })
}