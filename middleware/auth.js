export default async function ({ $supabase, route, redirect }) {
	const user = $supabase.auth.user();

	if (!user && route.name !== 'auth') {
		return redirect('/auth');
	}

	if (user) {
		const userId = user.id;
		const response = await fetch(`/api/user/checkUser?userId=${userId}`);
		const data = await response.json();
		if (!data.exists && route.name !== 'signup') {
			return redirect('/signup');
		}
	}
}
