// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.req.method !== "POST") {
        event.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const body = await readBody(event);

    const { id, startDate, clubId, gender, nickname, iconUrl } = body;

    if (!id) {
        event.res.statusCode = 400;
        return { error: "User ID is required" };
    }

    try {
        const user = await prisma.user.upsert({
            where: { id: id },
            update: {
                startDate: startDate ? new Date(startDate) : null,
                clubId: clubId ? parseInt(clubId) : null,
                gender: gender || null, // 성별 필드 추가
                nickname: nickname || null, // 닉네임 필드 추가
                iconUrl: iconUrl || null,
            },
            create: {
                id: id,
                gender: gender || null, // 성별 필드 추가
                startDate: startDate ? new Date(startDate) : null,
                clubId: clubId ? parseInt(clubId) : null,
                activityScore: 0,
                nickname: nickname || null, // 닉네임 필드 추가
                iconUrl: iconUrl || null,
            },
        });

        event.res.statusCode = 200;
        return user;
    } catch (error) {
        console.error("Error in upsert:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error" };
    } finally {
        await prisma.$disconnect();
    }
});
