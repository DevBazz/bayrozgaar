import { auth } from "@clerk/tanstack-react-start/server";

export async function requireAuth() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return userId;
}
