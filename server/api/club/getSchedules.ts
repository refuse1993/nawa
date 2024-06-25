// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const userId = body.userId;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { club: true },
	});

	if (!user) {
		event.res.statusCode = 404;
		return { error: 'User not found' };
	}

	if (!user.clubId) {
		event.res.statusCode = 400;
		return { error: 'User is not associated with any club' };
	}

	const schedules = await prisma.schedule.findMany({
		where: { clubId: user.clubId },
		orderBy: {
			date: 'desc', // 내림차순 정렬
		},
	});

	return schedules;
});
