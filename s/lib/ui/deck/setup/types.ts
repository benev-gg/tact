
import {Kv} from "@e280/kv"
import {Presets} from "../types.js"
import {Bindings} from "../../../input/types.js"

export type SetupParams<B extends Bindings> = {
	maxPlayers: number
	presets: Presets<B>
	namespace?: string
	kv?: Kv
	broadcastChannel?: BroadcastChannel
}

