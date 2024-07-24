import { DENIED, GRANTED, PermissionDef } from './util.js';

export const pushNotifications = new PermissionDef('PUSH_NOTIFICATIONS', {
	async checkAsync() {
		const registration = await navigator.serviceWorker.ready;
		const existing = await registration.pushManager.getSubscription();
		return existing ? GRANTED : DENIED;
	},
	async askAsync(opts) {
		const result = await Notification.requestPermission();
		if (result === 'denied') return DENIED;

		const registration = await navigator.serviceWorker.ready;
		const existing = await registration.pushManager.getSubscription();
		if (existing) return GRANTED;

		await registration.pushManager.subscribe(opts);
		return GRANTED;
	},
	async getConfigAsync() {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.getSubscription();
		if (sub) return JSON.parse(JSON.stringify(sub));
	},
});