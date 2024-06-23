// /server/api/schedule/leave.js
import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.scheduleId || !body.userId) {
		throw new Error('Schedule ID and User ID are required');
	}

	try {
		const scheduleParticipant = await prisma.scheduleParticipants.delete({
			where: {
				scheduleId_userId: {
					scheduleId: body.scheduleId,
					userId: body.userId,
				},
			},
		});
		return scheduleParticipant;
	} catch (error) {
		// 이미 존재하지 않는 경우 에러 무시
		return { message: 'Participant already removed or not found.' };
	}
});
