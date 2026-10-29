
import {Kv} from "@e280/kv"
import {StockProfiles} from "../types.js"
import {Bindings} from "../../../input/types.js"

export type SetupParams<B extends Bindings> = {
	maxPorts: number
	stock: StockProfiles<B>
	kv?: Kv
	broadcastChannel?: BroadcastChannel
}

