import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	console.log(body);

	// 기본값으로 오늘 날짜 사용
	let creationDate = new Date(body.creationDate);
	if (isNaN(creationDate.getTime())) {
		creationDate = new Date();
	}

	try {
		const newClub = await prisma.club.create({
			data: {
				representativeId: body.representativeId,
				creationDate: creationDate,
				logoUrl: body.logoUrl,
				name: body.name,
				description: body.description || '', // 기본값으로 빈 문자열 사용
			},
		});

		await prisma.user.update({
			where: { id: body.representativeId },
			data: { clubId: newClub.id },
		});

		return newClub;
	} catch (error) {
		console.error('Error creating club:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	}
});
