
import {RMap} from "@e280/strata"
import {guarantee} from "@e280/stz"

import {PlayerId} from "./types.js"
import {Decoder} from "../../input/decoder.js"
import {Bindings, Inputs} from "../../input/types.js"
import {decodeParcels} from "../../input/data/parcel/decode.js"

export class Players<B extends Bindings> {
	#bindings: B
	#decoders = new RMap<PlayerId, Decoder<B>>()

	constructor(bindings: B) {
		this.#bindings = bindings
	}

	decodeAll(...buffers: Uint8Array[]) {
		if (buffers.length === 0)
			return {added: [], removed: []}

		const added: PlayerId[] = []
		const removed: PlayerId[] = []
		const grouped = new Map<PlayerId, Uint8Array[]>()

		for (const buffer of buffers)
			for (const {playerId, intents} of decodeParcels(buffer))
				guarantee(grouped, playerId, () => []).push(intents)

		for (const [playerId, intents] of grouped) {
			let decoder = this.#decoders.get(playerId)
			if (!decoder) {
				decoder = new Decoder(this.#bindings)
				this.#decoders.set(playerId, decoder)
				added.push(playerId)
			}
			decoder.decode(...intents)
		}

		for (const playerId of this.#decoders.keys()) {
			if (!grouped.has(playerId)) {
				this.#decoders.delete(playerId)
				removed.push(playerId)
			}
		}

		return {added, removed}
	}

	get size() {
		return this.#decoders.size
	}

	has(playerId: PlayerId) {
		return this.#decoders.has(playerId)
	}

	get(playerId: PlayerId) {
		return this.#decoders.get(playerId)?.inputs
	}

	keys() {
		return this.#decoders.keys()
	}

	*values() {
		for (const {inputs} of this.#decoders.values())
			yield inputs
	}

	*entries() {
		for (const [playerId, {inputs}] of this.#decoders)
			yield [playerId, inputs] as [PlayerId, Inputs<B>]
	}

	[Symbol.iterator]() {
		return this.entries()
	}
}

