
import {StockProfiles} from "../types.js"
import {Bindings} from "../../../input/types.js"

export function firstStock<B extends Bindings>(stock: StockProfiles<B>) {
	const [key, profile] = Object.entries(stock)[0]
	return {key, profile}
}

