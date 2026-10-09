
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

	resolve(...datas: InputData[]): Inputs<B> {
		for (const input of this.#investigation.inputList) {
			input.was = input.value
			input.pulses = 0
			input.change = 0
			input.up = 0
			input.down = 0
			input.highest = null
			input.lowest = null
		}

		for (const data of datas) {
			const decoded = decodeData(data)

			if (decoded.hash !== this.#investigation.hash)
				throw new Error("intent bindings hash mismatch")


			for (const {id, value} of decoded.intents) {
				const input = this.#investigation.inputList[id]
				if (!input) throw new Error(`unknown input id ${id}`)

				const previous = input.value
				input.value = value
				input.pulses += value

				if (value !== previous) input.change++
				if (!isDown(previous) && isDown(value)) input.down++
				if (isDown(previous) && !isDown(value)) input.up++

				input.lowest = Math.min(input.lowest ?? value, value)
				input.highest = Math.max(input.highest ?? value, value)
			}
		}

		return this.inputs
	}
}

