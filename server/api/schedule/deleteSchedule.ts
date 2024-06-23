import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'DELETE') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	const query = getQuery(event);
	const scheduleId = query.scheduleId;

	if (!scheduleId) {
		event.res.statusCode = 400;
		return { error: 'Invalid request: scheduleId is required' };
	}

	try {
		// Delete participants associated with the schedule
		await prisma.scheduleParticipants.deleteMany({
			where: { scheduleId: parseInt(scheduleId) },
		});

		// Find matches associated with the schedule and delete their related teams and members
		const matches = await prisma.match.findMany({
			where: { scheduleId: parseInt(scheduleId) },
			include: { teams: { include: { members: true } } },
		});

		for (const match of matches) {
			for (const team of match.teams) {
				await prisma.member.deleteMany({
					where: { teamId: team.id },
				});
			}
			await prisma.team.deleteMany({
				where: { matchId: match.id },
			});
			await prisma.match.delete({
				where: { id: match.id },
			});
		}

		// Delete the schedule
		await prisma.schedule.delete({
			where: { id: parseInt(scheduleId) },
		});

		event.res.statusCode = 200;
		return { success: true, message: 'Schedule and related records deleted successfully' };
	} catch (error) {
		console.error('Error deleting schedule:', error.message);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
