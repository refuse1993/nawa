// /server/api/schedule/join.js
import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.scheduleId || !body.userId) {
		throw new Error('Schedule ID and User ID are required');
	}

	// 기존 참가자 확인
	const existingParticipant = await prisma.scheduleParticipants.findUnique({
		where: {
			scheduleId_userId: {
				scheduleId: body.scheduleId,
				userId: body.userId,
			},
		},
	});

	if (existingParticipant) {
		return existingParticipant;
	}

	// 새로운 참가자 추가
	const scheduleParticipant = await prisma.scheduleParticipants.create({
		data: {
			scheduleId: body.scheduleId,
			userId: body.userId,
		},
	});

	return scheduleParticipant;
});
