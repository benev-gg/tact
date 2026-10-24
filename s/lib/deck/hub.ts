
import {RMap, RSet} from "@e280/strata"
import {got, IdCounter} from "@e280/stz"

import {Controller} from "../input/controller.js"
import {Bindings, Intent} from "../input/types.js"
import {encodeData} from "../input/data/encode.js"
import {hashBindings} from "../input/investigate/hash-bindings.js"

export type PortId = number

export class Hub<B extends Bindings = any> {
	#hash
	#ids = new IdCounter()
	#datas = new RMap<PortId, ArrayBuffer>()
	#unassigned = new RSet<Controller>()
	#ports = new RMap<PortId, {
		controllers: RSet<Controller>,
		intents: RMap<number, number>,
	}>()

	constructor(bindings: B) {
		this.#hash = hashBindings(bindings)
	}

	get portIds() {
		return [...this.#ports.keys()]
	}

	get controllers() {
		return {
			unassigned: [...this.#unassigned],
			assigned: new Map<PortId, Controller<B>[]>(
				[...this.#ports]
					.map(([portId, port]) => [portId, [...port.controllers]])
			),
		}
	}

	createPort(): PortId {
		const portId = this.#ids.next()
		this.#ports.set(portId, {controllers: new RSet(), intents: new RMap()})
		return portId
	}

	deletePort(portId: PortId) {
		this.#ports.get(portId)?.controllers.forEach(c => this.#unassigned.add(c))
		this.#ports.delete(portId)
	}

	add(controller: Controller<B>) {
		this.unplug(controller)
	}

	remove(controller: Controller<B>) {
		this.unplug(controller)
		this.#unassigned.delete(controller)
	}

	unplug(controller: Controller<B>) {
		this.#unassigned.add(controller)
		for (const port of this.#ports.values())
			port.controllers.delete(controller)
	}

	plug(portId: PortId, controller: Controller<B>) {
		this.unplug(controller)
		got(this.#ports.get(portId)).controllers.add(controller)
		this.#unassigned.delete(controller)
	}

	encode(portId: PortId, time = performance.now()) {
		const {controllers, intents} = got(this.#ports.get(portId))

		for (const id of intents.keys())
			intents.set(id, 0)

		for (const controller of controllers) {
			for (const intent of controller.evaluate(time)) {
				const knownValue = intents.get(intent.id) ?? 0
				const mergedValue = knownValue + intent.value
				intents.set(intent.id, mergedValue)
			}
		}

		return encodeData(
			this.#hash,
			[...intents]
				.map(([id, value]): Intent => ({id, value})),
		)
	}

	encodeAll(time = performance.now()) {
		this.#datas.clear()

		for (const portId of this.#ports.keys())
			this.#datas.set(portId, this.encode(portId, time))

		return this.#datas
	}
}

