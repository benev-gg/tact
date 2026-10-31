
import {disposer, ev} from "@e280/stz"
import {IdbMagazine, idbOpen, Kv} from "@e280/kv"
import {Hub} from "../hub.js"
import {asDeck} from "../types.js"
import {SetupParams} from "./types.js"
import {Controls} from "../controls/controls.js"
import {Bindings} from "../../../input/types.js"
import {firstPreset} from "../utils/first-preset.js"

export async function setupDeck<B extends Bindings>(params: SetupParams<B>) {
	const {dispose, schedule} = disposer()
	const broadcastWasProvided = !!params.broadcastChannel

	const namespace = params.namespace
		? `tact_${params.namespace}`
		: "tact"

	const kv = params.kv
		?? new Kv(new IdbMagazine(await idbOpen(namespace, "kv")))

	const broadcastChannel = params.broadcastChannel
		?? new BroadcastChannel(namespace)

	const {maxPlayers} = params
	const {bindings} = firstPreset(params.presets).profile
	const hub = new Hub(bindings)
	const controls = new Controls({...params, kv})

	await controls.load()

	schedule(ev(broadcastChannel, {message: () => controls.load()}))
	schedule(controls.on(() => broadcastChannel.postMessage({})))
	if (!broadcastWasProvided)
		schedule(() => broadcastChannel.close())

	return asDeck({hub, controls, maxPlayers, dispose})
}

