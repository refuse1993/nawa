import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { scheduleId } = getQuery(event);

	if (!scheduleId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Schedule ID is required',
		});
	}

	const schedule = await prisma.schedule.findUnique({
		where: {
			id: parseInt(scheduleId),
		},
		select: {
			date: true,
			location: true,
		},
	});

	if (!schedule) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Schedule not found',
		});
	}

	return schedule;
});
