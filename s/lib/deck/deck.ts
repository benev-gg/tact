
import {Kv} from "@e280/kv"
import {given} from "@e280/stz"
import {RMap} from "@e280/strata"
import {Hub} from "./hub.js"
import {Bindings} from "../input/types.js"
import {Controller} from "../input/controller.js"
import {onPad} from "../input/utils/pad/on-pad.js"
import {GamepadSource} from "../input/sources/gamepad.js"

export class Deck<B extends Bindings = any> {
	#params
	readonly controllerProfiles = new RMap<Controller, string>()

	constructor(params: {
			kv: Kv
			hub: Hub<B>
			bindings: B
			profiles: Record<string, {label: string, bindings: B}>
			primary: {
				profile: string
				controller: Controller<B>
			}
		}) {

		const {hub, primary} = params
		this.controllerProfiles.set(primary.controller, primary.profile)

		const port = hub.createPort()
		hub.add(primary.controller)
		hub.plug(port, primary.controller)

		this.#params = params
	}

	get hub() { return this.#params.hub }
	get bindings() { return this.#params.bindings }
	get profiles() { return this.#params.profiles }
	get primary() { return this.#params.primary }

	autoGamepads() {
		return onPad(pad => {
			const {hub} = this
			const controller = new Controller({
				source: new GamepadSource(pad),
				bindings: this.#params.bindings,
				handle: `${pad.gamepad.id} ${pad.gamepad.index}`,
			})
			hub.add(controller)
			given(hub.portIds.at(-1), id => hub.plug(id, controller))
			return () => hub.remove(controller)
		})
	}
}

