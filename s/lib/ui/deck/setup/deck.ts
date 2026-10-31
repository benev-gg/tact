
import {Hub} from "../hub.js"
import {asDeck} from "../types.js"
import {setupKv} from "./setup-kv.js"
import {SetupParams} from "./types.js"
import {Controls} from "../controls/controls.js"
import {Bindings} from "../../../input/types.js"
import {firstPreset} from "../utils/first-preset.js"

export async function setupDeck<B extends Bindings>(params: SetupParams<B>) {
	const kv = params.kv
		?? await setupKv()

	const broadcastChannel = params.broadcastChannel
		?? new BroadcastChannel("tact")

	const {maxPlayers} = params
	const {bindings} = firstPreset(params.presets).profile

	const hub = new Hub(bindings)
	const controls = new Controls({...params, kv})

	await controls.load()

	broadcastChannel.onmessage = () => controls.load()
	controls.on(() => broadcastChannel.postMessage({}))

	return asDeck({hub, controls, maxPlayers})
}

