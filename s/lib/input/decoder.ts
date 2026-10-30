
import {Inputs, Bindings} from "./types.js"
import {decodeIntents} from "./data/intent/decode.js"
import {investigate} from "./investigate/investigate.js"

export class InputDecoder<B extends Bindings> {
	#investigation

	constructor(bindings: B) {
		this.#investigation = investigate(bindings)
	}

	get inputs() {
		return this.#investigation.inputs
	}

	decode(...buffers: ArrayBuffer[]): Inputs<B> {
		for (const input of this.#investigation.inputList)
			input.was = input.value

		for (const buffer of buffers) {
			const decoded = decodeIntents(buffer)

			if (decoded.hash !== this.#investigation.hash)
				throw new Error("intent bindings hash mismatch")

			for (const {id, value} of decoded.intents) {
				const input = this.#investigation.inputList[id]
				if (!input) throw new Error(`unknown input id ${id}`)
				input.value = value
			}
		}

		return this.inputs
	}
}

