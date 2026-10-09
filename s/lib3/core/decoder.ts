
import {isDown} from "./utils/is-down.js"
import {decodeData} from "./data/decode.js"
import {Inputs, Bindings, InputData} from "./types.js"
import {investigate} from "./investigate/investigate.js"

export class InputDecoder<B extends Bindings> {
	#investigation

	constructor(bindings: B) {
		this.#investigation = investigate(bindings)
	}

	get inputs() {
		return this.#investigation.inputs
	}

	resolve(data: InputData): Inputs<B> {
		const decoded = decodeData(data)

		if (decoded.hash !== this.#investigation.hash)
			throw new Error("intent bindings hash mismatch")

		for (const [inputId, input] of this.#investigation.inputList.entries()) {
			input.pulses = 0
			input.change = 0
			input.up = 0
			input.down = 0
			input.highest = null
			input.lowest = null

			for (const {id, value} of decoded.intents) {
				if (id === inputId) {
					const previous = input.value

					input.value = value
					input.pulses += value

					if (value !== previous)
						input.change++

					if (!isDown(previous) && isDown(value))
						input.down++

					if (isDown(previous) && !isDown(value))
						input.up++
				}
			}
		}

		return this.inputs
	}
}

