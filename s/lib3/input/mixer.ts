
import {Intent} from "./types.js"
import {InputEncoder} from "./encoder.js"
import {encodeData} from "./data/encode.js"

export class InputMixer {
	encoders = new Set<InputEncoder<any>>()
	constructor(private hash: number) {}

	encode(time = performance.now()) {
		const intents: Intent[] = []

		for (const encoder of this.encoders)
			for (const intent of encoder.evaluate(time))
				intents.push(intent)

		return encodeData(this.hash, intents)
	}
}

