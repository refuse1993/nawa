import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'DELETE') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	const query = getQuery(event);
	const matchId = query.matchId;

	if (!matchId) {
		event.res.statusCode = 400;
		return { error: 'Invalid request: matchId is required' };
	}

	try {
		// Delete members associated with the match
		const teams = await prisma.team.findMany({
			where: { matchId: parseInt(matchId) },
			include: { members: true },
		});

		for (const team of teams) {
			await prisma.member.deleteMany({
				where: { teamId: team.id },
			});
		}

		// Delete teams associated with the match
		await prisma.team.deleteMany({
			where: { matchId: parseInt(matchId) },
		});

		// Delete the match
		await prisma.match.delete({
			where: { id: parseInt(matchId) },
		});

		event.res.statusCode = 200;
		return { success: true, message: 'Match and related records deleted successfully' };
	} catch (error) {
		console.error('Error deleting match:', error.message);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
