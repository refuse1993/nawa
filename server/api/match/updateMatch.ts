import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	if (event.req.method !== 'PUT') {
		event.res.statusCode = 405;
		return { error: 'Method not allowed' };
	}

	const body = await readBody(event);

	if (!body.id || !body.teams || !Array.isArray(body.teams)) {
		event.res.statusCode = 400;
		return { error: 'Invalid request body' };
	}

	const { id, date, location, youtubeLink, type, teams } = body;

	try {
		const updateTeams = await Promise.all(
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

				const averageScore = memberScores.reduce((acc, score) => acc + score, 0) / memberScores.length || 0;

				await prisma.member.deleteMany({
					where: { teamId: team.id },
				});

				await prisma.team.update({
					where: { id: team.id },
					data: {
						score: team.score,
						winStatus: team.winStatus,
						averageScore: averageScore,
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
										id: body.clubId,
									},
								},
							})),
						},
					},
				});
			})
		);

		const updatedMatch = await prisma.match.update({
			where: { id: parseInt(id) },
			data: {
				date: new Date(date),
				location,
				youtubeLink,
				type,
				teams: {
					update: updateTeams,
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

		event.res.statusCode = 200;
		return {
			success: true,
			data: updatedMatch,
		};
	} catch (error) {
		console.error('Error updating match:', error.message);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	} finally {
		await prisma.$disconnect();
	}
});
