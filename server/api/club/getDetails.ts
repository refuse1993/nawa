// import { PrismaClient } from ".prisma/client";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { clubId } = getQuery(event);

	if (!clubId) {
		event.res.statusCode = 400;
		return { error: 'Club ID is required' };
	}

	try {
		console.log('Fetching club with ID:', clubId);
		const club = await prisma.club.findUnique({
			where: { id: parseInt(clubId) },
			include: {
				matches: {
					include: {
						teams: true,
					},
				},
			},
		});

		if (!club) {
			event.res.statusCode = 404;
			return { error: 'Club not found' };
		}

		const representative = await prisma.user.findUnique({
			where: { id: club.representativeId },
			select: {
				id: true,
				nickname: true,
			},
		});

		const members = await prisma.user.findMany({
			where: { clubId: parseInt(clubId) },
			select: {
				id: true,
				nickname: true,
				iconUrl: true,
			},
		});

		console.log('Club found:', club);
		console.log('members found:', members);
		event.res.statusCode = 200;
		return {
			...club,
			representative,
			members,
		};
	} catch (error) {
		console.error('Error fetching club details:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
