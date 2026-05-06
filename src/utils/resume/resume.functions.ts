import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { getResume, upsertResume } from "./resume.server";
import pdfParse from "pdf-parse";

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

export const parseAndSaveResumeFn = createServerFn({ method: "POST" })
	.inputValidator((data: { url: string; base64Data: string }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();

		let content = '';
		try {
			const base64 = data.base64Data.split(',')[1] || data.base64Data;
			const buffer = Buffer.from(base64, 'base64');
			const result = await pdfParse(buffer);
			content = result.text.trim();
		} catch (err) {
			throw new Error(`Failed to parse PDF: ${err instanceof Error ? err.message : String(err)}`);
		}

		const resume = await upsertResume(userId, data.url, content);
		if (!resume) throw new Error('Failed to save resume.');
		return resume;
	});
