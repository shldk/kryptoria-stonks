import { Config } from './config';
import { Trade, Trading } from './trading';
import { Http } from './http';

require('dotenv').config();

(async function main() {
	await Http.init();
	await checkTrades();

	setInterval(() => {
		checkTrades();
	}, Config.pollingRate);
})()

async function checkTrades(): Promise<Trade[]> {
	const trades = await Trading.getActiveTrades();
	const matchingTrades = trades.filter(trade => matchesCriteria(trade));

	matchingTrades.forEach(trade => Trading.acceptTrade(trade));

	return matchingTrades;
}

function matchesCriteria(trade: Trade): boolean { // Receive and send are backwards for trades and criterias
	return Config.criterias.some(criteria => {
		if (!criteria.send.includes(trade.receiveResource)) {
			return false;
		}

		if (!criteria.receive.includes(trade.sendResource)) {
			return false;
		}

		return trade.receiveAmount / trade.sendAmount <= criteria.maxRatio;
	})
}