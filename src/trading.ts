import { AxiosResponse } from 'axios';
import { Http } from './http';

export const Resources = ['binaryCode', 'bioSynth', 'kryptoOre', 'metaSpice', 'uniShard'] as const;
export type Resource = typeof Resources[number];

export type Trade = {
	id: number;
	sendResource: Resource;
	sendAmount: number;
	receiveResource: Resource;
	receiveAmount: number;
}

export type TradeCriteria = {
	send: readonly Resource[];
	receive: readonly Resource[];
	maxRatio: number;
}

export class Trading {
	static Resources = {
		all: () => Resources,
		except: (...excludedResources: Array<Resource>) => Resources.filter(resource => !excludedResources.includes(resource))
	}

	static async getActiveTrades(): Promise<Array<Trade>> {
		return await Http.api.get('/trades', {
			params: {
				page: 1,
				pageSize: 50,
			},
		}).then((d: AxiosResponse) => d?.data?.pageData)
	}

	static async acceptTrade(trade: Trade) {
		return await Http.api.post(
			'/trade/accept',
			{ id: trade.id }
		).then(() => console.info(`Bought "${trade.sendAmount} ${trade.sendResource}" for "${trade.receiveAmount} ${trade.receiveResource}"`));
	}
}