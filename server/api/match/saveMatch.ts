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
		const createMatches = await Promise.all(
			matches.map(async (match) => {
				const { date, location, clubId, youtubeLink, type, teams } = match;

				const teamsWithAverageScore = await Promise.all(
					teams.map(async (team) => {
						const memberScores = await Promise.all(
							team.members.map(async (member) => {
								const user = await prisma.user.findUnique({
									where: { id: member.userId },
									select: { activityScore: true },
								});

								if (!user) {
									throw new Error(`User with id ${member.userId} not found`);
								}
								return user.activityScore;
							})
						);

						const averageScore =
							memberScores.reduce((acc, score) => acc + score, 0) / memberScores.length || 0;
						return {
							...team,
							averageScore,
							members: team.members.map((member) => ({
								...member,
								scoreChange: 0,
							})),
						};
					})
				);

				return prisma.match.create({
					data: {
						scheduleId: parseInt(scheduleId),
						date: new Date(date),
						location,
						youtubeLink,
						type,
						clubId: parseInt(clubId),
						teams: {
							create: teamsWithAverageScore.map((team) => ({
								score: team.score,
								winStatus: team.winStatus,
								averageScore: team.averageScore,
								members: {
									create: team.members.map((member) => ({
										user: {
											connect: {
												id: member.userId,
											},
										},
										scoreChange: member.scoreChange,
										club: {
											connect: {
												id: clubId,
											},
										},
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
			})
		);

		event.res.statusCode = 200;
		return {
			success: true,
			data: createMatches,
		};
	} catch (error) {
		console.error('Error saving matches:', error.message);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
