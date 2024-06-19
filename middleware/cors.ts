import { defineEventHandler, send } from 'h3';

export default defineEventHandler(async (event) => {
	const headers = {
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
		'Access-Control-Allow-Headers':
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
	};

	for (const [key, value] of Object.entries(headers)) {
		event.res.setHeader(key, value);
	}

	if (event.req.method === 'OPTIONS') {
		return send(event, '');
	}
});
