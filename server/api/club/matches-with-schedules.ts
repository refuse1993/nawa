// api/club/matches-with-schedules.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { clubId } = getQuery(event);

    if (!clubId) {
        event.res.statusCode = 400;
        return { error: "Club ID is required" };
    }

    try {
        console.log("Fetching matches and schedules for club with ID:", clubId);
        const matches = await prisma.match.findMany({
            where: {
                clubId: parseInt(clubId),
            },
            include: {
                teams: {
                    include: {
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                schedule: true, // 일정 정보 포함
            },
        });

        if (!matches || matches.length === 0) {
            event.res.statusCode = 404;
            return { error: "No matches found" };
        }

        event.res.statusCode = 200;
        return matches;
    } catch (error) {
        console.error("Error fetching matches and schedules:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
