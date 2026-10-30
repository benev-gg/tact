
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
		const inputs = this.#investigation.inputList

		for (const input of inputs) {
			input.was = input.value
			input.sum = 0
		}

		for (const buffer of buffers) {
			const decoded = decodeIntents(buffer)

			if (decoded.hash !== this.#investigation.hash)
				throw new Error("intent bindings hash mismatch")

			for (const input of inputs)
				input.value = 0

			for (const {id, value} of decoded.intents) {
				const input = inputs[id]
				input.value = value
			}

			for (const input of inputs)
				input.sum += input.value
		}

		return this.inputs
	}
}

