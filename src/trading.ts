import { AxiosResponse } from 'axios';
import Http from './http';

export const Resources = ['binaryCode', 'bioSynth', 'kryptoOre', 'metaSpice', 'uniShard'] as const;
export type Resource = typeof Resources[number];

export interface Trade {
	id: number;
	sendResource: Resource;
	sendAmount: number;
	receiveResource: Resource;
	receiveAmount: number;
}

class Trading {
	Resources = {
		all: () => Resources,
		except: (...excludedResources: Array<Resource>) => Resources.filter(resource => !excludedResources.includes(resource))
	}

	async getActiveTrades(): Promise<Array<Trade>> {
		return await Http.axios.get('https://auth.kryptoria.io/kryptoria/api/v1/trades', {
			params: {
				page: 1,
				pageSize: 50,
			},
		}).then((d: AxiosResponse) => d?.data?.pageData)
	}

	async acceptTrade(trade: Trade) {
		return await Http.axios.post(
			'https://auth.kryptoria.io/kryptoria/api/v1/trade/accept',
			{ id: trade.id }
		).then(() => console.info(`Bought "${trade.sendAmount} ${trade.sendResource}" for "${trade.receiveAmount} ${trade.receiveResource}"`));
	}
}

export default new Trading();