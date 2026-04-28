import { db } from "#/lib/db";

export async function upsertResume(clerkId: string, url: string, content: string) {
	const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
	if (!user) throw new Error("User not found");

	return db.resume.upsert({
		where: { userId: user.id },
		create: { userId: user.id, url, content },
		update: { url, content },
	});
}

export async function getResume(clerkId: string) {
	const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
	if (!user) throw new Error("User not found");

	return db.resume.findUnique({
		where: { userId: user.id },
	});
}
