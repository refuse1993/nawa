// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from ".prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "DELETE") {
        event.node.res.statusCode = 405;
        return { error: "Method not allowed" };
    }

    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
        event.node.res.statusCode = 400;
        return { error: "User ID is required" };
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });

        event.node.res.statusCode = 200;
        return { message: "User deleted successfully" };
    } catch (error) {
        console.error("Error deleting user:", error);
        event.node.res.statusCode = 500;
        return { error: "Internal server error" };
    } finally {
        await prisma.$disconnect();
    }
});
