
import {RMap} from "@e280/strata"
import {guarantee} from "@e280/stz"

import {PlayerId} from "./types.js"
import {Bindings} from "../../input/types.js"
import {InputDecoder} from "../../input/decoder.js"
import {decodeParcels} from "../../input/data/parcel/decode.js"

export class Collector<B extends Bindings> {
	#bindings: B
	#decoders = new RMap<PlayerId, InputDecoder<B>>()

	constructor(bindings: B) {
		this.#bindings = bindings
	}

	get players() {
		return [...this.#decoders].map(([playerId, decoder]) => ({
			playerId,
			inputs: decoder.inputs,
		}))
	}

	#getDecoder(playerId: PlayerId) {
		return guarantee(
			this.#decoders,
			playerId,
			() => new InputDecoder(this.#bindings),
		)
	}

	decodeAll(...buffers: ArrayBuffer[]) {
		const grouped = new Map<PlayerId, ArrayBuffer[]>()

		for (const buffer of buffers) {
			for (const {playerId, intents} of decodeParcels(buffer))
				guarantee(grouped, playerId, () => []).push(intents)
		}

		for (const [playerId, intents] of grouped)
			this.#getDecoder(playerId).decode(...intents)

		for (const playerId of this.#decoders.keys()) {
			if (!grouped.has(playerId))
				this.#decoders.delete(playerId)
		}

		return this.players
	}
}

