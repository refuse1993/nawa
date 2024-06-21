import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const body = await useBody(event);

	if (!body.scheduleId || !Array.isArray(body.matches)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid request body',
		});
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

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error('Error saving matches:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
		});
	}
});
