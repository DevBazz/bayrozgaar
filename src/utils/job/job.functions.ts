import { createServerFn } from "@tanstack/react-start";
import type { Prisma } from "#/generated/prisma/client";
import { requireAuth } from "#/lib/auth";
import {
	createJob,
	deleteJob,
	getAllJobs,
	getJobByEmployer,
	getJobById,
	getJobWithApplication,
	updateJob,
} from "./job.server";

export const createJobFn = createServerFn({ method: "POST" })
	.inputValidator((data: Prisma.JobCreateWithoutUserInput) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return createJob(userId, data);
	});

export const getJobByIdFn = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async ({ data }) => {
		return getJobById(data);
	});

export const getAllJobFn = createServerFn({ method: "GET" })
	.handler(async () => {
		return getAllJobs();
	});

export const getJobByEmployerFn = createServerFn({ method: "GET" })
	.handler(async () => {
		const userId = await requireAuth();
		return getJobByEmployer(userId);
	});

export const updateJobFn = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string; jobData: Prisma.JobUpdateInput }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();

		const job = await getJobById(data.id);
		if (job?.user.clerkId !== userId) throw new Error("Unauthorized");

		return updateJob(data.id, data.jobData);
	});

export const deleteJobFn = createServerFn({ method: "POST" })
	.inputValidator((id: string) => id)
	.handler(async ({ data }) => {
		const userId = await requireAuth();

		const job = await getJobById(data);
		if (job?.user.clerkId !== userId) throw new Error("Unauthorized");

		return deleteJob(data);
	});

export const getJobWithApplicationFn = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return getJobWithApplication(userId, data);
	});
