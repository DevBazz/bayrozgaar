import { db } from "#/lib/db";

export async function createApplication(clerkId: string, jobId: string, resumeId: string) {
	const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
	if (!user) throw new Error("User not found");

	const existing = await db.application.findFirst({
		where: { jobId, userId: user.id },
	});

	if (existing) throw new Error("Already applied to this job");

	return db.application.create({
		data: {
			jobId,
			resumeId,
			userId: user.id,
		},
	});
}

export async function getAppliedJobs(clerkId: string) {
	return db.application.findMany({
		where: { user: { clerkId } },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			matchScore: true,
			status: true,
			createdAt: true,
			job: {
				select: {
					id: true,
					title: true,
					location: true,
					type: true,
					jobMode: true,
					user: {
						select: {
							companyName: true,
							companySite: true,
						},
					},
				},
			},
		},
	});
}
