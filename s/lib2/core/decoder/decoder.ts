
import {decodeData} from "../utils/data.js"
import {updateInput} from "./utils/update-input.js"
import {Inputs, Bindings, InputData} from "../types.js"
import {investigate} from "../encoder/parts/investigate.js"

export class InputDecoder<B extends Bindings> {
	#investigation

	constructor(bindings: B) {
		this.#investigation = investigate(bindings)
	}

	get inputs() {
		return this.#investigation.inputs
	}

	resolve(data: InputData): Inputs<B> {
		const {hash, inputList} = this.#investigation
		const decoded = decodeData(data)

		if (decoded.hash !== hash)
			throw new Error("intent bindings hash mismatch")

		for (const {id, value} of decoded.intentions) {
			const input = inputList[id]
			if (!input) throw new Error(`unknown action id ${id}`)
			updateInput(input, value)
		}

		return this.inputs
	}
}

