import { PrismaClient } from "@prisma/client";
import { readBody, useQuery } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.req.method !== "PUT") {
        event.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const { scheduleId } = getQuery(event);
    const body = await readBody(event);

    if (!scheduleId || !body.date || !body.location) {
        event.res.statusCode = 400;
        return { error: "Invalid request body" };
    }

    try {
        const updatedSchedule = await prisma.schedule.update({
            where: { id: parseInt(scheduleId) },
            data: {
                date: new Date(body.date),
                location: body.location,
            },
        });

        event.res.statusCode = 200;
        return {
            success: true,
            data: updatedSchedule,
        };
    } catch (error) {
        console.error("Error updating schedule:", error.message);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
