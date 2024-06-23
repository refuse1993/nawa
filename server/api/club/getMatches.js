import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userId } = getQuery(event);

    if (!userId) {
        throw new Error("User ID is required");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { club: true },
    });

    if (!user || !user.clubId) {
        throw new Error("User or club not found");
    }

    const matches = await prisma.match.findMany({
        where: { clubId: user.clubId },
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
            schedule: true,
        },
    });

    return matches;
});
