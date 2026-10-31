
import {disposer, ev} from "@e280/stz"
import {Hub} from "../hub.js"
import {asDeck} from "../types.js"
import {setupKv} from "./utils/kv.js"
import {SetupParams} from "./types.js"
import {Controls} from "../controls/controls.js"
import {Bindings} from "../../../input/types.js"
import {firstPreset} from "../utils/first-preset.js"
import {setupBroadcastChannel} from "./utils/broadcast-channel.js"

export async function setupDeck<B extends Bindings>(params: SetupParams<B>) {
	const {dispose, schedule, disposable} = disposer()

	const namespace = params.namespace
		? `tact_${params.namespace}`
		: "tact"

	const {kv} = disposable(
		await setupKv(namespace, params.kv)
	)

	const {broadcastChannel} = disposable(
		await setupBroadcastChannel(namespace, params.broadcastChannel)
	)

	const {maxPlayers} = params
	const {bindings} = firstPreset(params.presets).profile
	const hub = new Hub(bindings)
	const controls = new Controls({...params, kv})

	schedule(ev(broadcastChannel, {message: () => controls.load()}))
	schedule(controls.on(() => broadcastChannel.postMessage({})))

	await controls.load()

	return asDeck({hub, controls, maxPlayers, dispose})
}

