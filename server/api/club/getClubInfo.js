import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'GET') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	try {
		const clubs = await prisma.club.findMany({
			select: {
				id: true,
				name: true,
				logoUrl: true,
				creationDate: true,
			},
		});

		if (!clubs || clubs.length === 0) {
			event.res.statusCode = 404;
			return { error: 'No clubs found' };
		}

		event.res.statusCode = 200;
		return clubs;
	} catch (error) {
		console.error('Error fetching clubs:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
