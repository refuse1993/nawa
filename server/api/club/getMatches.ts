import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { userId } = getQuery(event);

	if (!userId) {
		event.res.statusCode = 400;
		return { error: 'User ID is required' };
	}

	let user;
	try {
		user = await prisma.user.findUnique({
			where: { id: userId },
			include: { club: true },
		});
	} catch (error) {
		console.error('Error fetching user:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	}

	if (!user) {
		event.res.statusCode = 404;
		return { error: 'User not found' };
	}

	// 사용자가 클럽에 가입되어 있지 않은 경우 빈 배열 반환
	if (!user.clubId) {
		return [];
	}

	let matches;
	try {
		matches = await prisma.match.findMany({
			where: { clubId: user.clubId },
			include: {
				teams: {
					include: {
						members: {
							include: {
								user: true,
							},
						},
					},
				},
				schedule: true,
			},
		});
	} catch (error) {
		console.error('Error fetching matches:', error);
		event.res.statusCode = 500;
		return { error: 'Internal server error', details: error.message };
	}

	return matches;
});
