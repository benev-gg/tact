
import {RMap, RSet} from "@e280/strata"
import {got, IdCounter} from "@e280/stz"

import {PlayerId} from "./types.js"
import {Bindings} from "../../input/types.js"
import {Controller} from "../../input/controller.js"
import {encodeParcels} from "../../input/data/parcel/encode.js"
import {encodeIntents} from "../../input/data/intent/encode.js"
import {hashBindings} from "../../input/investigate/hash-bindings.js"

export class Hub<B extends Bindings = any> {
	#hash
	#ids = new IdCounter()
	#unassigned = new RSet<Controller<B>>()
	#players = new RMap<PlayerId, {controllers: RSet<Controller<B>>}>()

	constructor(readonly bindings: B) {
		this.#hash = hashBindings(bindings)
	}

	get playerIds() {
		return [...this.#players.keys()]
	}

	get controllers() {
		return {
			unassigned: [...this.#unassigned],
			assigned: new Map<PlayerId, Controller<B>[]>(
				[...this.#players]
					.map(([playerId, port]) => [playerId, [...port.controllers]])
			),
		}
	}

	createPlayer(): PlayerId {
		const playerId = this.#ids.next()
		this.#players.set(playerId, {controllers: new RSet()})
		return playerId
	}

	deletePlayer(playerId: PlayerId) {
		this.#players.get(playerId)?.controllers.forEach(c => this.#unassigned.add(c))
		this.#players.delete(playerId)
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
		for (const port of this.#players.values())
			port.controllers.delete(controller)
		return this
	}

	plug(controller: Controller<B>, playerId?: PlayerId) {
		playerId ??= this.playerIds.at(-1) ?? this.createPlayer()
		this.unplug(controller)
		got(this.#players.get(playerId)).controllers.add(controller)
		this.#unassigned.delete(controller)
		return this
	}

	encode(playerId: PlayerId, time = performance.now()) {
		const intents = new Map<number, number>()
		const {controllers} = got(this.#players.get(playerId))

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
		const parcels = Array.from(this.#players.keys()).map(playerId => ({
			playerId,
			intents: this.encode(playerId, time),
		}))

		// encode parcels.
		return encodeParcels(parcels)
	}
}

