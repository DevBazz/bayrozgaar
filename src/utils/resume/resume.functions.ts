import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "#/lib/auth";
import { getResume, upsertResume } from "./resume.server";
import { PDFParse } from 'pdf-parse';

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
	.inputValidator((data: { url: string }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		console.log('[resume] url received:', data.url);

		let content = '';
		try {
			const response = await fetch(data.url);
			console.log('[resume] fetch status:', response.status, response.headers.get('content-type'));
			if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status}`);
			const buffer = Buffer.from(await response.arrayBuffer());
			console.log('[resume] buffer size:', buffer.length);
			
			// Use pdf-parse v2 API - create instance with data
			const parser = new PDFParse({ data: buffer });
			const textResult = await parser.getText();
			content = textResult.text.trim();
			console.log('[resume] parsed content length:', content.length);
		} catch (err) {
			console.error('[resume] PDF parse error:', err);
			throw new Error(`Failed to parse PDF: ${err instanceof Error ? err.message : String(err)}`);
		}

		const resume = await upsertResume(userId, data.url, content);
		if (!resume) throw new Error('Failed to save resume.');
		return resume;
	});
