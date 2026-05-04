import type { ApplicationStatus } from "#/generated/prisma/enums";
import { scoreResumeAgainstJob } from "#/lib/ai";
import { db } from "#/lib/db";

export async function createApplication(
	clerkId: string,
	jobId: string,
	resumeId: string,
) {
	const user = await db.user.findUnique({
		where: { clerkId },
		select: { id: true },
	});
	if (!user) throw new Error("User not found");

	const existing = await db.application.findFirst({
		where: { jobId, userId: user.id },
	});
	if (existing) throw new Error("Already applied to this job");

	const [resume, job] = await Promise.all([
		db.resume.findUnique({ where: { id: resumeId }, select: { content: true } }),
		db.job.findUnique({ where: { id: jobId }, select: { title: true, description: true, requirements: true } }),
	]);

	let matchScore: number | null = null;
	if (resume?.content && job) {
		matchScore = await scoreResumeAgainstJob(resume.content, job.title, job.description, job.requirements);
	}

	return db.application.create({
		data: { jobId, resumeId, userId: user.id, matchScore },
	});
}

export async function updateApplicationStatus(
	applicationId: string,
	clerkId: string,
	status: ApplicationStatus,
) {
	const application = await db.application.findUnique({
		where: { id: applicationId },
		include: { job: { include: { user: { select: { clerkId: true } } } } },
	});

	if (!application) throw new Error("Application not found");
	if (application.job.user.clerkId !== clerkId) throw new Error("Unauthorized");

	return db.application.update({
		where: { id: applicationId },
		data: { status },
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
