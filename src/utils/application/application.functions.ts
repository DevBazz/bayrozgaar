import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { createApplication, getAppliedJobs, updateApplicationStatus } from "./application.server";

export const createApplicationFn = createServerFn({ method: "POST" })
	.inputValidator((data: { jobId: string; resumeId: string }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return createApplication(userId, data.jobId, data.resumeId);
	});

export const getAppliedJobsFn = createServerFn({ method: "GET" })
	.handler(async () => {
		const userId = await requireAuth();
		return getAppliedJobs(userId);
	});

export const updateApplicationStatusFn = createServerFn({ method: "POST" })
	.inputValidator((data: { applicationId: string; status: "Pending" | "Reviewed" | "Accepted" | "Rejected" }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return updateApplicationStatus(data.applicationId, userId, data.status);
	});
