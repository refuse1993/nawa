import { useUserStore } from '~/stores/user';

export default async function ({ store, route, redirect }) {
	const userStore = useUserStore();

	await userStore.setUser();

	if (!userStore.user && route.name !== 'auth') {
		return redirect('/auth');
	}

	if (userStore.user && !userStore.club && route.name !== 'signup') {
		return redirect('/signup');
	}
}
