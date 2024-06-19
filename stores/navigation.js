import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
	state: () => ({
		activeTab: 'club',
	}),
	actions: {
		setActiveTab(tab) {
			this.activeTab = tab;
		},
	},
});
