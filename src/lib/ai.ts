import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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

	const response = await groq.chat.completions.create({
		model: "llama-3.3-70b-versatile",
		messages: [
			{
				role: "system",
				content: "You are a recruitment AI assistant. Your task is to score resumes against job descriptions. Return ONLY a number between 0 and 100.",
			},
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 0.1, // Low temperature for more consistent scoring
		max_tokens: 10, // We only need a number
	});

	const scoreText = response.choices[0]?.message?.content ?? "0";
	const score = Number.parseFloat(scoreText.trim());
	return Number.isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
}