import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { createApplication, getAppliedJobs } from "./application.server";

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
