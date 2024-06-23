import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.date || !body.location || !body.creatorId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'All fields are required',
		});
	}

	try {
		const schedule = await prisma.schedule.create({
			data: {
				date: new Date(body.date),
				location: body.location,
				creatorId: parseInt(body.creatorId),
				clubId: 1, // 예시로, clubId를 1로 설정
			},
		});

		return { success: true, schedule };
	} catch (error) {
		console.error('Error creating schedule:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
		});
	}
});
