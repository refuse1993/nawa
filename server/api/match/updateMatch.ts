import { PrismaClient } from "@prisma/client";
import { readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.req.method !== "PUT") {
        event.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const body = await readBody(event);

    if (!body.id || !body.youtubeLink || !body.scheduleId) {
        event.res.statusCode = 400;
        return { error: "Invalid request body" };
    }

    const { id, youtubeLink, scheduleId } = body;

    try {
        // 매치 업데이트: 유튜브 URL과 일정 ID 수정
        const updatedMatch = await prisma.match.update({
            where: { id: parseInt(id) },
            data: {
                youtubeLink,
                scheduleId: parseInt(scheduleId),
            },
            include: {
                schedule: true,
                teams: {
                    include: {
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        event.res.statusCode = 200;
        return {
            success: true,
            data: updatedMatch,
        };
    } catch (error) {
        console.error("Error updating match:", error.message);
        event.res.statusCode = 500;
        return { error: "Internal server error", details: error.message };
    } finally {
        await prisma.$disconnect();
    }
});
