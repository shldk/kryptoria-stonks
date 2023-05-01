import { AxiosResponse } from "axios";
import Http from './http';

const Web3 = require('web3');
const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);

const address = process.env.WALLET_ADDRESS;

interface UserData {
	token: string;
}

class Auth {
	async loadToken(): Promise<string> {
		const now = Date.now();
		const signature = await this.getSignature(now);
		const { token } = await this.getUserData(signature, now);

		return token;
	}

	private async getSignature(timestamp: number): Promise<string> {
		web3.eth.accounts.wallet.add(process.env.WALLET_PK);

		return await web3.eth.sign(`${address}${timestamp}POST/kryptoria/api/v1/wallet/login`, address);
	}

	private async getUserData(signature: string, timestamp: number): Promise<UserData> {
		return await Http.axios.post('https://auth.kryptoria.io/kryptoria/api/v1/wallet/login', {
			address,
			signature,
			timestamp
		}).then((d: AxiosResponse) => d.data);
	}
}

export default new Auth();