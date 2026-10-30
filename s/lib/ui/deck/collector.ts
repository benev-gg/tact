
import {RMap} from "@e280/strata"
import {guarantee} from "@e280/stz"

import {PortId} from "./hub.js"
import {Bindings} from "../../input/types.js"
import {InputDecoder} from "../../input/decoder.js"
import {decodeParcels} from "../../input/data/parcel/decode.js"

export class Collector<B extends Bindings> {
	#bindings: B
	#decoders = new RMap<PortId, InputDecoder<B>>()

	constructor(bindings: B) {
		this.#bindings = bindings
	}

	get players() {
		return [...this.#decoders].map(([playerId, decoder]) => ({
			playerId,
			inputs: decoder.inputs,
		}))
	}

	#getDecoder(portId: PortId) {
		return guarantee(
			this.#decoders,
			portId,
			() => new InputDecoder(this.#bindings),
		)
	}

	decodeAll(...buffers: ArrayBuffer[]) {
		const grouped = new Map<PortId, ArrayBuffer[]>()

		for (const buffer of buffers) {
			for (const {portId, intents} of decodeParcels(buffer))
				guarantee(grouped, portId, () => []).push(intents)
		}

		for (const [portId, intents] of grouped)
			this.#getDecoder(portId).decode(...intents)

		for (const portId of this.#decoders.keys()) {
			if (!grouped.has(portId))
				this.#decoders.delete(portId)
		}

		return this.players
	}
}

