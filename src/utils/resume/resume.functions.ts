import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { getResume, upsertResume } from "./resume.server";

export const upsertResumeFn = createServerFn({ method: "POST" })
	.inputValidator((data: { url: string; content: string }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return upsertResume(userId, data.url, data.content);
	});

export const getResumeFn = createServerFn({ method: "GET" })
	.handler(async () => {
		const userId = await requireAuth();
		return getResume(userId);
	});
