
import {RMap, RSet} from "@e280/strata"
import {got, IdCounter, setEntries} from "@e280/stz"

import {Bindings} from "../../input/types.js"
import {Controller} from "../../input/controller.js"
import {encodeIntents} from "../../input/data/intent/encode.js"
import {hashBindings} from "../../input/investigate/hash-bindings.js"
import { encodeParcels } from "../../input/data/parcel/encode.js"

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

		for (const controller of controllers) {
			for (const intent of controller.evaluate(time)) {
				const alpha = intents.get(intent.id) ?? 0
				intents.set(intent.id, alpha + intent.value)
			}
		}

		const changedIntents = [...intents]
			.filter(([, value]) => value !== 0)
			.map(([id, value]) => ({id, value}))

		return encodeIntents(this.#hash, changedIntents)
	}

	encodeAll(time = performance.now()) {

		// drain and discard unused controller inputs.
		for (const controller of this.#unassigned)
			controller.clear()

		// encode intents.
		const parcels = Array.from(this.#ports.keys()).map(portId => ({
			portId,
			intents: this.encode(portId, time),
		}))

		// encode parcels.
		return encodeParcels(parcels)
	}
}

