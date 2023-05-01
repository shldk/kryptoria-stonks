import Auth from './auth';
import { AxiosResponse } from 'axios';

class Http {
	axios = require('axios').default;

	async init() {
		await this.loadAuthorization();

		this.axios.interceptors.response.use((response: AxiosResponse) => response, async (e: any) => {
			const originalRequest = e.request;
			if (e.response?.status === 403 && !originalRequest._retry) {
				originalRequest._retry = true;

				await this.loadAuthorization();

				return this.axios(originalRequest);
			}
			return Promise.reject(e);
		});
	}

	private async loadAuthorization() {
		const token = await Auth.loadToken();

		this.axios.withCredentials = true;
		this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
}

export default new Http();

