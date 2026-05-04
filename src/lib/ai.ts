import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function scoreResumeAgainstJob(
	resumeContent: string,
	jobTitle: string,
	jobDescription: string,
	requirements: string[],
): Promise<number> {
	const prompt = `
You are a recruitment AI. Score how well this resume matches the job posting.
Return ONLY a number between 0 and 100. No explanation, no text, just the number.

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
REQUIREMENTS: ${requirements.join(", ")}

RESUME:
${resumeContent}
`.trim();

	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: prompt,
	});

	const score = Number.parseFloat(response.text ?? "0");
	return Number.isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
}
