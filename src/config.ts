import { TradeCriteria, Trading } from './trading';

export const Config: { criterias: TradeCriteria[], pollingRate: number } = {
	criterias: [
		{
			send: ['bioSynth'],
			receive: Trading.Resources.except('bioSynth'),
			maxRatio: 995 / 650
		},
		{
			send: ['metaSpice'],
			receive: Trading.Resources.except('bioSynth'),
			maxRatio: 995 / 995
		},
		{
			send: ['kryptoOre', 'uniShard'],
			receive: ['kryptoOre', 'uniShard'],
			maxRatio: 500 / 995
		}
	],
	pollingRate: 10000
}