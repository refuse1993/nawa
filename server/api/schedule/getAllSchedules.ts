// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { clubId } = getQuery(event);

    if (!clubId) {
        event.res.statusCode = 400;
        return { error: "Club ID is required" };
    }

    try {
        const allschedule = await prisma.schedule.findMany({
            where: { clubId: parseInt(clubId) },
        });

        event.res.statusCode = 200;
        return allschedule;
    } catch (error) {
        console.error("Error fetching user club:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
