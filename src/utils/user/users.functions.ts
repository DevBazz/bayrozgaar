import { clerkClient } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import type { Prisma } from "#/generated/prisma/client";
import { requireAuth } from "#/lib/auth";
import {
	createUser,
	getUserByClerkId,
	getUserData,
	updateUserById,
	updateUserToEmployer,
} from "./users.server";

export const syncUser = createServerFn({ method: "POST" }).handler(async () => {
	const userId = await requireAuth();

	const existingUser = await getUserByClerkId(userId);
	if (existingUser) return existingUser;

	const clerk = clerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
	const user = await clerk.users.getUser(userId);

	if (!user) return null;

	return createUser({
		clerkId: userId,
		name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
		email: user.emailAddresses[0].emailAddress,
		username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
	});
});

export const updateUser = createServerFn({ method: "POST" })
	.inputValidator((data: { user: Prisma.UserUpdateInput }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();
		return updateUserById(userId, data.user);
	});

export const getRole = createServerFn({ method: "GET" })
	.handler(async () => {
		const userId = await requireAuth();
		const user = await getUserByClerkId(userId);
		return user?.role;
	});

export const getUser = createServerFn({ method: "GET" })
	.handler(async () => {
		const userId = await requireAuth();
		return getUserData(userId);
	});

export const updateUserRole = createServerFn({ method: "POST" })
	.inputValidator((data: { role: "Employer" | "Employee"; companyName?: string; companySite?: string }) => data)
	.handler(async ({ data }) => {
		const userId = await requireAuth();

		if (data.role === "Employer") {
			if (!data.companyName || !data.companySite) throw new Error("Company name and site are required");
			return updateUserToEmployer(userId, data.companyName, data.companySite);
		}

		return updateUserById(userId, { role: "Employee" });
	});
