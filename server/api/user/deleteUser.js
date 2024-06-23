// import { PrismaClient } from '@prisma/client';
import { readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.req.method !== "DELETE") {
        event.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
        event.res.statusCode = 400;
        return { error: "User ID is required" };
    }

    try {
        // 더미 사용자 ID (미리 데이터베이스에 추가된 사용자)
        const deletedUserId = "your-deleted-user-id";

        // 외래 키로 연결된 테이블에서 userId 값을 deletedUserId로 업데이트
        await prisma.scheduleParticipants.updateMany({
            where: { userId: userId },
            data: { userId: deletedUserId },
        });

        await prisma.comment.updateMany({
            where: { userId: userId },
            data: { userId: deletedUserId },
        });

        await prisma.like.updateMany({
            where: { userId: userId },
            data: { userId: deletedUserId },
        });

        await prisma.member.updateMany({
            where: { userId: userId },
            data: { userId: deletedUserId },
        });

        // 이제 사용자를 삭제합니다.
        await prisma.user.delete({
            where: { id: userId },
        });

        event.res.statusCode = 200;
        return { message: "User deleted successfully" };
    } catch (error) {
        console.error("Error deleting user:", error);
        event.res.statusCode = 500;
        return { error: "Internal server error" };
    } finally {
        await prisma.$disconnect();
    }
});
