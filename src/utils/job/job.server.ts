import type { Prisma } from "#/generated/prisma/client";
import { db } from "#/lib/db";

export async function createJob(
	userId: string,
	data: Prisma.JobCreateWithoutUserInput,
) {
	return db.job.create({
		data: {
			...data,
			user: { connect: { clerkId: userId } },
		},
	});
}

export async function getJobById(id: string) {
	return db.job.findUnique({
		where: { id },
		include: {
			user: {
				select: {
                    clerkId: true,
					companyName: true,
					companySite: true,
				},
			},
			_count: {
				select: { applications: true },
			},
		},
	});
}

export async function getAllJobs() {
	return db.job.findMany({
		include: {
			user: {
				select: {
					companyName: true,
					companySite: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function getJobByEmployer(clerkId: string) {
	return db.job.findMany({
		where: {
			user: { clerkId },
		},
		include: {
			_count: { select: { applications: true } },
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function updateJob(id: string, data: Prisma.JobUpdateInput) {
	return db.job.update({
		where: { id },
		data,
	});
}

export async function deleteJob(id: string) {
	return db.job.delete({
		where: { id },
	});
}

export async function getJobWithApplication(clerkId: string, id: string) {
	return db.job.findUnique({
		where: {
			id,
			user: { clerkId },
		},
		include: {
			applications: {
				orderBy: { matchScore: "desc" },
				select: {
					id: true,
					matchScore: true,
					status: true,
					createdAt: true,
					user: {
						select: {
							name: true,
							email: true,
							phone: true,
						},
					},
					resume: {
						select: {
							url: true,
						},
					},
				},
			},
		},
	});
}
