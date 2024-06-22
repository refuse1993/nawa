import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'POST') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	const body = await readBody(event);

	if (!body.scheduleId || !Array.isArray(body.matches)) {
		event.res.statusCode = 400;
		return { error: 'Invalid request body' };
	}

	const { scheduleId, matches } = body;

	try {
		const createMatches = matches.map((match) => {
			const { date, location, youtubeLink, type, teams } = match;

			return prisma.match.create({
				data: {
					scheduleId: parseInt(scheduleId),
					date: new Date(date),
					location,
					youtubeLink,
					type,
					teams: {
						create: teams.map((team) => ({
							score: team.score,
							winStatus: team.winStatus,
							members: {
								create: team.members.map((member) => ({
									userId: member.userId,
								})),
							},
						})),
					},
				},
				include: {
					teams: {
						include: {
							members: true,
						},
					},
				},
			});
		});

		const result = await prisma.$transaction(createMatches);

		event.res.statusCode = 200;
		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error('Error saving matches:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error' };
	} finally {
		await prisma.$disconnect();
	}
});
