import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	// Fetch all schedule participants without requiring Schedule ID
	const participants = await prisma.scheduleParticipants.findMany({
		include: {
			user: {
				select: {
					id: true,
					nickname: true,
					iconUrl: true, // Include icon URL
				},
			},
		},
	});

	return participants.map((participant) => ({
		scheduleId: participant.scheduleId,
		userId: participant.userId,
		nickname: participant.user.nickname,
		iconUrl: participant.user.iconUrl, // Include icon URL
	}));
});
