require('dotenv').config();

import Http from './http';
import Trading, { Resource, Trade } from './trading';

const criterias: Array<TradeCriteria> = [
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
];

(async function main() {
	await Http.init();
	await checkTrades();

	setInterval(() => {
		checkTrades();
	}, 10000);
})()

async function checkTrades(): Promise<Trade[]> {
	const trades = await Trading.getActiveTrades();
	const matchingTrades = trades.filter(trade => matchesCriteria(trade));

	matchingTrades.forEach(trade => Trading.acceptTrade(trade));

	return matchingTrades;
}

function matchesCriteria(trade: Trade): boolean { // Receive and send are backwards for trades and criterias
	return criterias.some(criteria => {
		if (!criteria.send.includes(trade.receiveResource)) {
			return false;
		}

		if (!criteria.receive.includes(trade.sendResource)) {
			return false;
		}

		return trade.receiveAmount / trade.sendAmount <= criteria.maxRatio;
	})
}

type TradeCriteria = {
	send: readonly Resource[];
	receive: readonly Resource[];
	maxRatio: number;
}