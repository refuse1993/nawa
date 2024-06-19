import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'POST') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	const body = await readBody(event);

	const { id, startDate, clubId } = body;

	if (!id) {
		event.res.statusCode = 400;
		return { error: 'User ID is required' };
	}

	try {
		const user = await prisma.user.upsert({
			where: { id: id },
			update: {
				startDate: startDate ? new Date(startDate) : null,
				clubId: clubId ? parseInt(clubId) : null,
			},
			create: {
				id: id,
				startDate: startDate ? new Date(startDate) : null,
				clubId: clubId ? parseInt(clubId) : null,
				activityScore: 0,
			},
		});

		event.res.statusCode = 200;
		return user;
	} catch (error) {
		console.error('Error in upsert:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error' };
	} finally {
		await prisma.$disconnect();
	}
});
