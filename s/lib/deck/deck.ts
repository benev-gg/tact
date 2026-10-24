
import {Kv} from "@e280/kv"
import {given, got, setEntries} from "@e280/stz"
import {RMap} from "@e280/strata"

import {Hub} from "./hub.js"
import {Bindings} from "../input/types.js"
import {Controller} from "../input/controller.js"
import {onPad} from "../input/utils/pad/on-pad.js"
import {GamepadSource} from "../input/sources/gamepad.js"

export type ProfileKey = string
export type Profile<B extends Bindings> = {label: string, bindings: B}

export class Profiles<B extends Bindings = any> {
	readonly default
	stock = new RMap<ProfileKey, Profile<B>>()
	custom = new RMap<ProfileKey, Profile<B>>()
	assignments = new RMap<Controller, ProfileKey>()

	constructor(stock: Record<ProfileKey, Profile<B>>) {
		this.default = got(Object.keys(stock)[0])
		setEntries(this.stock, Object.entries(stock))
	}
}

export type Deck<B extends Bindings = any> = {
	kv: Kv
	hub: Hub<B>
	bindings: B
	profiles: Profiles<B>
}

export const asDeck = <B extends Bindings>(deck: Deck<B>) => deck

export function primaryController<B extends Bindings>(
		hub: Hub<B>,
		profiles: Profiles<B>,
		controller: Controller<B>,
	) {
	profiles.assignments.set(controller, profiles.default)
	const port = hub.createPort()
	hub.add(controller)
	hub.plug(port, controller)
	return controller
}

export function autoGamepads(hub: Hub) {
	return onPad(pad => {
		const controller = new Controller({
			bindings: hub.bindings,
			source: new GamepadSource(pad),
			handle: `${pad.gamepad.id} ${pad.gamepad.index}`,
		})
		hub.add(controller)
		given(hub.portIds.at(-1), id => hub.plug(id, controller))
		return () => hub.remove(controller)
	})
}

// export class Deck<B extends Bindings = any> {
// 	#params
// 	readonly controllerProfiles = new RMap<Controller, string>()
//
// 	constructor(params: {
// 			kv: Kv
// 			hub: Hub<B>
// 			bindings: B
// 			profiles: Record<string, {label: string, bindings: B}>
// 			primary: {
// 				profile: string
// 				controller: Controller<B>
// 			}
// 		}) {
//
// 		const {hub, primary} = params
// 		this.controllerProfiles.set(primary.controller, primary.profile)
//
// 		const port = hub.createPort()
// 		hub.add(primary.controller)
// 		hub.plug(port, primary.controller)
//
// 		this.#params = params
// 	}
//
// 	get hub() { return this.#params.hub }
// 	get bindings() { return this.#params.bindings }
// 	get profiles() { return this.#params.profiles }
// 	get primary() { return this.#params.primary }
//
// 	autoGamepads() {
// 		return onPad(pad => {
// 			const {hub} = this
// 			const controller = new Controller({
// 				source: new GamepadSource(pad),
// 				bindings: this.#params.bindings,
// 				handle: `${pad.gamepad.id} ${pad.gamepad.index}`,
// 			})
// 			hub.add(controller)
// 			given(hub.portIds.at(-1), id => hub.plug(id, controller))
// 			return () => hub.remove(controller)
// 		})
// 	}
// }
//
