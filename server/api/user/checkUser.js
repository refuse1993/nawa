// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.req.method !== "GET") {
        event.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const { userId } = getQuery(event);

    if (!userId) {
        event.res.statusCode = 400;
        return { error: "User ID is required" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            event.res.statusCode = 404;
            return { error: "User not found" };
        }

        event.res.statusCode = 200;
        return { exists: true };
    } catch (error) {
        console.error("Error checking user:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
