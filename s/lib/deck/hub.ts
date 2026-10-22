
import {RMap} from "@e280/strata"
import {adds, count, deletes, got, IdCounter} from "@e280/stz"

import {Controller} from "../input/controller.js"
import {Bindings, Intent} from "../input/types.js"
import {encodeData} from "../input/data/encode.js"
import {hashBindings} from "../input/investigate/hash-bindings.js"

export type PortId = number

export class Hub<B extends Bindings = any> {
	#hash
	#ids = new IdCounter()
	#datas = new Map<PortId, ArrayBuffer>()
	#ports = new RMap<PortId, {
		controllers: Set<Controller>,
		intents: Map<number, number>,
	}>()

	constructor(options: {bindings: B, portCount: number}) {
		this.#hash = hashBindings(options.bindings)
		for (const _ of count(options.portCount))
			this.createPort()
	}

	get portIds() {
		return [...this.#ports.keys()]
	}

	createPort(): PortId {
		const portId = this.#ids.next()
		this.#ports.set(portId, {controllers: new Set(), intents: new Map()})
		return portId
	}

	deletePort(portId: PortId) {
		this.#ports.delete(portId)
	}

	unplug(...controllers: Controller<B>[]) {
		for (const port of this.#ports.values())
			deletes(port.controllers, controllers)
	}

	plug(portId: PortId, ...controllers: Controller<B>[]) {
		for (const port of this.#ports.values())
			deletes(port.controllers, controllers)
		adds(got(this.#ports.get(portId)).controllers, controllers)
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

