
import {RMap, RSet} from "@e280/strata"
import {got, IdCounter} from "@e280/stz"

import {Bindings} from "../../input/types.js"
import {Controller} from "../../input/controller.js"
import {encodeIntents} from "../../input/data/intent/encode.js"
import {hashBindings} from "../../input/investigate/hash-bindings.js"

export type PortId = number

export class Hub<B extends Bindings = any> {
	#hash
	#ids = new IdCounter()
	#unassigned = new RSet<Controller<B>>()
	#ports = new RMap<PortId, {
		controllers: RSet<Controller<B>>,
		intents: RMap<number, number>,
	}>()

	constructor(readonly bindings: B) {
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
		return this
	}

	add(controller: Controller<B>) {
		this.unplug(controller)
		return this
	}

	remove(controller: Controller<B>) {
		this.unplug(controller)
		this.#unassigned.delete(controller)
		return this
	}

	unplug(controller: Controller<B>) {
		this.#unassigned.add(controller)
		for (const port of this.#ports.values())
			port.controllers.delete(controller)
		return this
	}

	plug(controller: Controller<B>, portId?: PortId) {
		portId ??= this.portIds.at(-1) ?? this.createPort()
		this.unplug(controller)
		got(this.#ports.get(portId)).controllers.add(controller)
		this.#unassigned.delete(controller)
		return this
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

		return encodeIntents(
			this.#hash,
			[...intents].map(([id, value]) => ({id, value})),
		)
	}

	encodeAll(time = performance.now()): [portId: PortId, data: ArrayBuffer][] {

		// drain and discard unused controller inputs.
		for (const controller of this.#unassigned)
			controller.clear()

		// return tuples of port ids and the encoded input data.
		return Array.from(this.#ports.keys()).map(portId => [
			portId,
			this.encode(portId, time),
		])
	}
}

