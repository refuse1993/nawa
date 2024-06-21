import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const { scheduleId } = query;

	if (!scheduleId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Schedule ID is required',
		});
	}

	const participants = await prisma.scheduleParticipants.findMany({
		where: {
			scheduleId: parseInt(scheduleId),
		},
		include: {
			user: {
				select: {
					id: true,
					nickname: true,
				},
			},
		},
	});

	return participants.map((participant) => ({
		scheduleId: participant.scheduleId,
		userId: participant.userId,
		nickname: participant.user.nickname,
	}));
});
