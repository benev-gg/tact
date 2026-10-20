
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

	decode(...datas: InputData[]): Inputs<B> {
		for (const input of this.#investigation.inputList)
			input.was = input.value

		for (const data of datas) {
			const decoded = decodeData(data)

			if (decoded.hash !== this.#investigation.hash)
				throw new Error("intent bindings hash mismatch")

			for (const {id, value} of decoded.intents) {
				const input = this.#investigation.inputList[id]
				if (!input) throw new Error(`unknown input id ${id}`)
				input.value = value
				input.delta = input.value - input.was
			}
		}

		return this.inputs
	}
}

