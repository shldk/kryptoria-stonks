import Auth from './auth';
import { AxiosResponse, HttpStatusCode } from 'axios';

const axios = require('axios').default;

const baseURL: string = 'https://auth.kryptoria.io/kryptoria/api/v1';

class Http {
	publicApi = axios.create({
		baseURL
	});

	api = axios.create({
		baseURL,
		withCredentials: true
	});

	async init() {
		await this.loadAuthorization();

		this.api.interceptors.response.use((response: AxiosResponse) => response, async (e: any) => {
			const config = e.config;
			if (e.response?.status === HttpStatusCode.Unauthorized && !config._retry) {
				config._retry = true;
				config.headers.delete('Authorization');
				await this.loadAuthorization();

				return this.api(config);
			}
			return Promise.reject(e);
		});
	}

	private async loadAuthorization() {
		const token = await Auth.loadToken();

		return this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
}

export default new Http();