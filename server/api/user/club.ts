// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userId } = getQuery(event);

    if (!userId) {
        event.res.statusCode = 400;
        return { error: "User ID is required" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { club: true },
        });

        if (!user || !user.club) {
            event.res.statusCode = 404;
            return { error: "User or club not found" };
        }

        event.res.statusCode = 200;
        return { club: user.club };
    } catch (error) {
        console.error("Error fetching user club:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
