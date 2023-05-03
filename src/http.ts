import { Auth } from './auth';
import { AxiosResponse, HttpStatusCode } from 'axios';

const axios = require('axios').default;

const baseURL: string = 'https://auth.kryptoria.io/kryptoria/api/v1';

export class Http {
	static publicApi = axios.create({
		baseURL
	});

	static api = axios.create({
		baseURL,
		withCredentials: true
	});

	static async init() {
		await Http.loadAuthorization();

		Http.api.interceptors.response.use((response: AxiosResponse) => response, async (e: any) => {
			const config = e.config;
			if (e.response?.status === HttpStatusCode.Unauthorized && !config._retry) {
				config._retry = true;
				config.headers.delete('Authorization');
				await Http.loadAuthorization();

				return Http.api(config);
			}
			return Promise.reject(e);
		});
	}

	private static async loadAuthorization() {
		const token = await Auth.loadToken();

		return Http.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
}