import { AxiosResponse } from 'axios';
import { Http } from './http';

const Web3 = require('web3');
const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);

const address = process.env.WALLET_ADDRESS;

interface UserData {
	token: string;
}

export class Auth {
	static async loadToken(): Promise<string> {
		const now = Date.now();
		const signature = await Auth.getSignature(now);

		return await Auth.getUserData(signature, now);
	}

	private static async getSignature(timestamp: number): Promise<string> {
		web3.eth.accounts.wallet.add(process.env.WALLET_PK);

		return await web3.eth.sign(`${address}${timestamp}POST/kryptoria/api/v1/wallet/login`, address);
	}

	private static async getUserData(signature: string, timestamp: number): Promise<string> {
		return await Http.publicApi.post('/wallet/login', {
			address,
			signature,
			timestamp
		}).then((d: AxiosResponse) => d.data.token);
	}
}